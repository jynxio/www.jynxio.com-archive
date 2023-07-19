import shiki from 'shiki';
import util from 'node:util';
import path from 'node:path';
import { writeFile, readFile, readdir, mkdir, access, constants } from 'node:fs/promises';
import { nanoid } from 'nanoid';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import { parseSync } from 'svgson';

// TODO 是否需要为ParseHeadingNode补充检查？
// TODO 收集并输出post的目录，同时检查目录是否存在转义字符的bug
// TODO 收集并输出post的codeblock

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
const catalog = JSON.parse(
    await readFile(path.resolve() + '/src/configs/baseCatalog.json', 'utf8'),
);

/**
 * Markdown
 */
const highlighter = await shiki.getHighlighter({ theme: 'nord' });
const codeMap = new Map();
const h2Array = [];

try {
    await access(path.resolve() + '/src/temps', constants.R_OK | constants.W_OK);
} catch {
    await mkdir(path.resolve() + '/src/temps');
}

try {
    await access(path.resolve() + '/src/temps/blog', constants.R_OK | constants.W_OK);
} catch {
    await mkdir(path.resolve() + '/src/temps/blog');
}

try {
    await access(path.resolve() + '/src/temps/blog/post', constants.R_OK | constants.W_OK);
} catch {
    await mkdir(path.resolve() + '/src/temps/blog/post');
}

for (const dir of catalog) {
    const files = await readdir(path.resolve() + '/blog/post/' + dir.name);

    try {
        await access(path.resolve() + '/src/temps/blog/post/' + dir.name);
    } catch {
        await mkdir(path.resolve() + '/src/temps/blog/post/' + dir.name);
    }

    for (const file of files) {
        codeMap.clear();
        h2Array.length = 0;

        const markdown = await readFile(
            path.resolve() + '/blog/post/' + dir.name + '/' + file,
            'utf8',
        );
        const html = markdown2html(markdown);

        writeFile(
            path.resolve() + '/src/temps/blog/post/' + dir.name + '/' + file.slice(0, -3) + '.html',
            html,
        );
    }
}

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
    // 自定义属性: data.hName, data.hProperties, data.hChildren
    (function deepTrave(node, parent) {
        switch (node.type) {
            case 'heading':
                processHeadingNode(node);
                break;

            case 'thematicBreak':
                processThematicBreakNode(node, parent);
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
                processCodeNode(node);
                break;

            default:
                break;
        }

        node.children?.forEach(child => deepTrave(child, node));
    })(mast);
}

function processHeadingNode(node) {
    // TODO 是否需要执行检查？比如限制一级标题的数量为1、限制标题内容仅能使用普通文本、禁止使用四级及以上的标题
    if (node.depth !== 2) return;

    h2Array.push(node.children[0].value); // TODO 请检查是否有转义字符，可通过查看react-handbook页面来检查
    node.data = { hProperties: { id: nanoid() } };
}

function processThematicBreakNode(node, parent) {
    const index = parent.children.findIndex(child => child === node);

    if (parent.children.length === 1) delete parent.children;
    else parent.children.splice(index, 1);
}

function processLinkNode(node) {
    if (node.children.length === 0) throw new Error('禁止内容为空');
    if (node.children.length > 1) throw new Error('禁止书写非普通文本');

    node.data = {
        hProperties: { target: '_blank' },
        hChildren: [
            { type: 'text', value: node.children[0].value },
            structuredClone(MAST_SVG_LINK),
        ],
    };
}

function processImageNode(node) {
    node.url = '/post/image' + node.url;
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
                class: 'checkbox' + child.checked ? ' checked' : '',
            },
        };

        delete child.checked;
    });
}

function processCodeNode(node) {
    const uuid = nanoid();
    const preString = highlighter.codeToHtml(node.value, { lang: node.lang });
    const from = preString.indexOf('<code>') + 6;
    const to = preString.lastIndexOf('</code>');
    const codeString = preString.slice(from, to);
    const divString =
        '<div>' +
        `<jynx-pre>` +
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

    codeMap.set(uuid, divString);
    node.type = 'text';
    node.value = uuid;

    delete node.meta;
    delete node.lang;
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
