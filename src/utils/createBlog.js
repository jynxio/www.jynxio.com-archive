import shiki from 'shiki';
import util from 'node:util';
import path from 'node:path';
import { writeFile, readFile, readdir, mkdir, access, constants } from 'node:fs/promises';
import { copy, remove } from 'fs-extra';
import { nanoid } from 'nanoid';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import { parseSync } from 'svgson';

/**
 * SVG
 */
const SVG_STRING_LINK =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>';
const SVG_STRING_CHECKBOX =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';
const SVG_STRING_COPY =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path><polyline points="20 6 9 17 4 12"></polyline><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>';
const SVG_STRING_COLLAPSE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>';

const MAST_SVG_LINK = svg2mast(SVG_STRING_LINK);
const MAST_SVG_CHECKBOX = svg2mast(SVG_STRING_CHECKBOX);

/**
 * Catalog
 */
const catalog = JSON.parse(await readFile(path.resolve() + '/src/configs/baseCatalog.json', 'utf8'));

/**
 * Markdown -> HTML
 */
const darkTheme = JSON.parse(await readFile(path.resolve() + '/src/themes/vitesse-dark.json', 'utf8'));
const lightTheme = JSON.parse(await readFile(path.resolve() + '/src/themes/vitesse-light.json', 'utf8'));
const darkHighlighter = await shiki.getHighlighter({ theme: darkTheme });
const lightHighlighter = await shiki.getHighlighter({ theme: lightTheme });
const codeMap = new Map(); // 收集codeblock的内容
const codeStringMap = new Map();
const h2Array = []; // 收集二级标题的内容
let h1Count = 0; // 统计一级标题的数量
let codeStringPath = ''; // TODO 这一堆写的太乱了！优化一下！

for (const dir of catalog) {
    const files = await readdir(path.resolve() + '/blog/post/' + dir.name);

    try {
        await access(path.resolve() + '/src/temps/blog/post/' + dir.name, constants.R_OK | constants.W_OK);
    } catch {
        await mkdir(path.resolve() + '/src/temps/blog/post/' + dir.name, { recursive: true });
    }

    try {
        await access(path.resolve() + '/src/temps/blog/code/' + dir.name, constants.R_OK | constants.W_OK);
    } catch {
        await mkdir(path.resolve() + '/src/temps/blog/code/' + dir.name, { recursive: true });
    }

    try {
        await access(path.resolve() + '/src/temps/blog/topic/' + dir.name, constants.R_OK | constants.W_OK);
    } catch {
        await mkdir(path.resolve() + '/src/temps/blog/topic/' + dir.name, { recursive: true });
    }

    for (const file of files) {
        // 还原
        codeMap.clear();
        codeStringMap.clear();
        h2Array.length = 0;
        h1Count = 0;
        codeStringPath = `/blog/code/${dir.name}/${file.slice(0, -3)}`;

        // 转译
        const markdown = await readFile(path.resolve() + '/blog/post/' + dir.name + '/' + file, 'utf8');
        const html = markdown2html(markdown);

        // 检查
        if (h1Count === 0) throw new Error('转译失败: 因为缺少一级标题');

        // 输出
        await writeFile(path.resolve() + '/src/temps/blog/post/' + dir.name + '/' + file.slice(0, -3) + '.html', html);
        await writeFile(
            path.resolve() + '/src/temps/blog/topic/' + dir.name + '/' + file.slice(0, -3) + '.json',
            JSON.stringify(h2Array),
        );

        for (const [uuid, string] of codeStringMap) {
            await writeFile(
                path.resolve() + '/src/temps/blog/code/' + dir.name + '/' + file.slice(0, -3) + '-' + uuid + '.txt',
                string,
            );
        }
    }
}

/**
 * Clone image folder
 */
await copy(path.resolve() + '/blog/image', path.resolve() + '/src/temps/blog/image');

/**
 * Move to public folder
 */
await remove(path.resolve() + '/public/blog');
await copy(path.resolve() + '/src/temps/blog', path.resolve() + '/public/blog');

function markdown2html(markdown) {
    const mast = fromMarkdown(markdown, {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()],
    });

    processMast(mast);

    const hast = toHast(mast);
    const html = toHtml(hast);
    let newHtml = html;

    for (const [k, v] of codeMap) {
        const from = newHtml.indexOf(k);
        const to = from + Array.from(k).length;

        newHtml = newHtml.slice(0, from) + v + newHtml.slice(to);
    }

    return newHtml;
}

function processMast(mast) {
    // 修改抽象语法树（自定义元素: data.hName/hProperties/hChildren）
    (function deepTrave(node, parent) {
        switch (node.type) {
            case 'heading':
                processHeadingNode(node, parent); // 此操作可能会制造出空节点
                break;

            case 'thematicBreak':
                processThematicBreakNode(node, parent); // 此操作会制造出空节点
                break;

            case 'link':
                processLinkNode(node);
                break;

            case 'image':
                processImageNode(node);
                break;

            case 'list':
                processListNode(node);
                break;

            case 'code':
                processCodeNode(node, parent);
                break;

            default:
                break;
        }

        node.children?.forEach(child => deepTrave(child, node));
    })(mast);

    // 清除抽象语法树中的空节点
    (function deepTrave(node) {
        if (!node.children) return;
        if (!node.children.length) return;

        node.children = node.children.filter(child => node.children.includes(child));

        if (!node.children.length) {
            delete node.children;
            return;
        }

        node.children.forEach(child => deepTrave(child));
    })(mast);
}

function processHeadingNode(node, parent) {
    // 检查
    if (node.children.length === 0) throw new Error('转译失败: 因为某个标题元素的内容为空');
    if (node.children.length > 1) throw new Error('转译失败: 因为某个标题元素使用了非普通的文本');
    if (node.depth >= 4) throw new Error('转译失败: 因为使用了大于或等于四级的标题元素');
    if (node.depth === 1 && ++h1Count > 1) throw new Error('转译失败: 因为使用了超过两个及以上的一级标题元素');

    // 处理&收集二级标题
    if (node.depth !== 2) return;
    if (node.children[0].value.includes('typora-root-url')) {
        const index = parent.children.findIndex(child => child === node);
        parent.children.length === 1 ? delete parent.children : delete parent.children[index];

        return;
    }

    const uuid = nanoid();

    node.data = { hProperties: { id: uuid } };
    h2Array.push({ text: node.children[0].value, uuid });
}

function processThematicBreakNode(node, parent) {
    const index = parent.children.findIndex(child => child === node);
    parent.children.length === 1 ? delete parent.children : delete parent.children[index];
}

function processLinkNode(node) {
    if (node.children.length === 0) throw new Error('转译失败: 因为某个链接元素的内容为空');
    if (node.children.length > 1) throw new Error('转译失败: 因为某个链接元素使用了非普通的文本');

    node.data = {
        hProperties: { target: '_blank' },
        hChildren: [{ type: 'text', value: node.children[0].value }, structuredClone(MAST_SVG_LINK)],
    };
}

function processImageNode(node) {
    node.url = '/blog/image' + node.url;
}

function processListNode(node) {
    node.children.forEach(child => {
        if (child.checked === null) return;

        const id = nanoid();

        child.children[0].children.unshift({
            type: 'root',
            data: {
                hChildren: [
                    {
                        type: 'element',
                        tagName: 'input',
                        properties: {
                            id,
                            disabled: true,
                            type: 'checkbox',
                            checked: child.checked,
                        },
                    },
                    {
                        type: 'element',
                        tagName: 'label',
                        properties: { for: id },
                        children: [MAST_SVG_CHECKBOX],
                    },
                ],
            },
        });
        child.data = {
            hProperties: {
                class: 'checkbox' + (child.checked ? ' checked' : ''),
            },
        };

        delete child.checked;
    });
}

function processCodeNode(node, parent) {
    const globalUuid = nanoid();

    /**
     * Light theme
     */
    let lightCode = '';
    const lightUuid = nanoid();
    {
        const preString = lightHighlighter.codeToHtml(node.value, { lang: node.lang });
        const from = preString.indexOf('<code>') + 6;
        const to = preString.lastIndexOf('</code>');
        const codeString = preString.slice(from, to);
        const divString =
            '<div class="custom-pre light">' +
            `<jynx-pre data-url=${codeStringPath + '-' + globalUuid + '.txt'}>` +
            "<pre slot='panel'>" +
            '<code>' +
            codeString +
            '</code>' +
            '</pre>' +
            "<button slot='collapse-button'>" +
            SVG_STRING_COLLAPSE +
            '</button>' +
            "<button slot='copy-button'>" +
            SVG_STRING_COPY +
            '</button>' +
            '</jynx-pre>' +
            '</div>';

        lightCode = divString;
    }

    /**
     * Dark theme
     */
    let darkCode = '';
    const darkUuid = nanoid();
    {
        const preString = darkHighlighter.codeToHtml(node.value, { lang: node.lang });
        const from = preString.indexOf('<code>') + 6;
        const to = preString.lastIndexOf('</code>');
        const codeString = preString.slice(from, to);
        const divString =
            '<div class="custom-pre dark">' +
            `<jynx-pre data-url=${codeStringPath + '-' + globalUuid + '.txt'}>` +
            "<pre slot='panel'>" +
            '<code>' +
            codeString +
            '</code>' +
            '</pre>' +
            "<button slot='collapse-button'>" +
            SVG_STRING_COLLAPSE +
            '</button>' +
            "<button slot='copy-button'>" +
            SVG_STRING_COPY +
            '</button>' +
            '</jynx-pre>' +
            '</div>';

        darkCode = divString;
    }

    /**
     *
     */
    codeMap.set(lightUuid, lightCode);
    codeMap.set(darkUuid, darkCode);
    codeStringMap.set(globalUuid, node.value);

    const index = parent.children.indexOf(node);

    if (index === -1) throw new Error('未能在当前的node的parent的children中找到该node，这是不可能的情况');

    parent.children.splice(index, 1, { type: 'text', value: lightUuid }, { type: 'text', value: darkUuid });
}

function svg2mast(svgString) {
    const json = parseSync(svgString);

    (function deepTrave(json) {
        json.tagName = json.name;
        json.properties = json.attributes;
        json.value && json.children.push({ type: 'text', value: json.value });

        delete json.name;
        delete json.attributes;
        delete json.value;

        if (json.children.length === 0) delete json.children;

        json.children?.forEach(child => deepTrave(child));
    })(json);

    return json;
}
