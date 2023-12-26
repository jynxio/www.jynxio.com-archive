import shiki from 'shiki';
import path from 'node:path';
import { writeFile, readFile, readdir } from 'node:fs/promises';
import { emptyDir } from 'fs-extra';
import { nanoid } from 'nanoid';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import { parseSync } from 'svgson';

/**
 *
 */
const ignoreFileNames = ['.DS_Store'];

/**
 * SVG
 */
const SVG_STRING_COPY_IDLE =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const SVG_STRING_COPY_PENDING =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>';
const SVG_STRING_COPY_RESOLVED =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>';
const SVG_STRING_COPY_REJECTED =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
const SVG_STRING_LINK =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>';
const SVG_STRING_CHECKBOX =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-square"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';
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

	await emptyDir(path.resolve() + '/public/blog/post/' + dir.name);
	await emptyDir(path.resolve() + '/public/blog/code/' + dir.name);
	await emptyDir(path.resolve() + '/public/blog/topic/' + dir.name);

	for (const file of files) {
		if (ignoreFileNames.includes(file)) continue;

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
		await writeFile(path.resolve() + '/public/blog/post/' + dir.name + '/' + file.slice(0, -3) + '.html', html);
		await writeFile(
			path.resolve() + '/public/blog/topic/' + dir.name + '/' + file.slice(0, -3) + '.json',
			JSON.stringify(h2Array),
		);

		for (const [uuid, string] of codeStringMap) {
			await writeFile(
				path.resolve() + '/public/blog/code/' + dir.name + '/' + file.slice(0, -3) + '-' + uuid + '.txt',
				string,
			);
		}
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
	node.url = '/blog/image' + node.url.slice(0, -4) + '.webp';
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

function processCodeNode(node) {
	const uuid = nanoid();
	const lightPreString = lightHighlighter.codeToHtml(node.value, { lang: node.lang });
	const lightCodeString = lightPreString.slice(
		lightPreString.indexOf('<code>') + 6,
		lightPreString.lastIndexOf('</code>'),
	);
	const darkPreString = darkHighlighter.codeToHtml(node.value, { lang: node.lang });
	const darkCodeString = darkPreString.slice(
		darkPreString.indexOf('<code>') + 6,
		darkPreString.lastIndexOf('</code>'),
	);

	const divString =
		`<jynxio-codeblock data-url=${codeStringPath + '-' + uuid + '.txt'}>` +
		'<pre slot="codeblock">' +
		`<code class="light">${lightCodeString}</code>` +
		`<code class="dark">${darkCodeString}</code>` +
		'</pre>' +
		'<button slot="copy">' +
		`<span class="idle">${SVG_STRING_COPY_IDLE}</span>` +
		`<span class="pending">${SVG_STRING_COPY_PENDING}</span>` +
		`<span class="resolved">${SVG_STRING_COPY_RESOLVED}</span>` +
		`<span class="rejected">${SVG_STRING_COPY_REJECTED}</span>` +
		'</button>' +
		`<button slot="collapse">${SVG_STRING_COLLAPSE}</button>` +
		'</jynxio-codeblock>';

	codeMap.set(uuid, divString);
	codeStringMap.set(uuid, node.value);

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
