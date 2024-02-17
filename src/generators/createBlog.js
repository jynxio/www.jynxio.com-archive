import path from 'node:path';
import createSvg from './createSvg';
import * as node from 'fs-extra';
import { getHighlighter } from 'shiki';
import { nanoid } from 'nanoid';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import { parseSync } from 'svgson';

const linkSvgMast = svg2mast(createSvg('link'));
const checkboxSvgMast = svg2mast(createSvg('checkbox'));

/**
 * Catalog
 */
const catalog = JSON.parse(await node.readFile(path.resolve() + '/src/configs/baseCatalog.json', 'utf8'));

/**
 * Markdown -> HTML
 */
const highlighter = await getHighlighter({ themes: ['vitesse-dark', 'vitesse-light'] });

const codeMap = new Map(); // 收集codeblock的内容
const codeStringMap = new Map();
const h2Array = []; // 收集二级标题的内容

let h1Count = 0; // 统计一级标题的数量
let codeStringPath = ''; // TODO 这一堆写的太乱了！优化一下！

for (const dir of catalog) {
	const files = await node.readdir(path.resolve() + '/blog/post/' + dir.name);

	await node.emptyDir(path.resolve() + '/public/blog/post/' + dir.name);
	await node.emptyDir(path.resolve() + '/public/blog/code/' + dir.name);
	await node.emptyDir(path.resolve() + '/public/blog/topic/' + dir.name);

	for (const file of files) {
		if (path.extname(file) !== '.md') continue;

		// 还原
		codeMap.clear();
		codeStringMap.clear();
		h2Array.length = 0;
		h1Count = 0;
		codeStringPath = `/blog/code/${dir.name}/${file.slice(0, -3)}`;

		// 转译
		const markdown = await node.readFile(path.resolve() + '/blog/post/' + dir.name + '/' + file, 'utf8');
		const html = await markdown2html(markdown);

		// 检查
		if (h1Count === 0) throw new Error('转译失败: 因为缺少一级标题');

		// 输出
		await node.writeFile(
			path.resolve() + '/public/blog/post/' + dir.name + '/' + file.slice(0, -3) + '.html',
			html,
		);
		await node.writeFile(
			path.resolve() + '/public/blog/topic/' + dir.name + '/' + file.slice(0, -3) + '.json',
			JSON.stringify(h2Array),
		);

		for (const [uuid, string] of codeStringMap) {
			await node.writeFile(
				path.resolve() + '/public/blog/code/' + dir.name + '/' + file.slice(0, -3) + '-' + uuid + '.txt',
				string,
			);
		}
	}
}

async function markdown2html(markdown) {
	const mast = fromMarkdown(markdown, {
		extensions: [gfm()],
		mdastExtensions: [gfmFromMarkdown()],
	});

	await processMast(mast);

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

async function processMast(mast) {
	// 修改抽象语法树（自定义元素: data.hName/hProperties/hChildren）
	await (async function deepTrave(node, parent) {
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
				await processCodeNode(node, parent);
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
		hChildren: [{ type: 'text', value: node.children[0].value }, structuredClone(linkSvgMast)],
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
						children: [checkboxSvgMast],
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

async function processCodeNode(node) {
	const uuid = nanoid();

	if (!highlighter.getLoadedLanguages().includes(node.lang)) await highlighter.loadLanguage(node.lang);

	const preString = await highlighter.codeToHtml(node.value, {
		lang: node.lang,
		themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
		defaultColor: false,
	});

	const codeString = preString.slice(preString.indexOf('<code>') + 6, preString.lastIndexOf('</code>'));

	const divString =
		`<jynxio-codeblock data-url=${codeStringPath + '-' + uuid + '.txt'}>` +
		'<pre slot="codeblock">' +
		`<code>${codeString}</code>` +
		'</pre>' +
		'<button slot="copy">' +
		`<span class="idle">${createSvg('copy-idle')}</span>` +
		`<span class="pending">${createSvg('copy-pending')}</span>` +
		`<span class="resolved">${createSvg('copy-resolved')}</span>` +
		`<span class="rejected">${createSvg('copy-rejected')}</span>` +
		'</button>' +
		`<button slot="collapse">${createSvg('collapse')}</button>` +
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
