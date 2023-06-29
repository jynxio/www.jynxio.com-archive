import { readFile, writeFile } from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";

// Hr, heading, listitem, code, link, checkbox, image

const filePath = new URL( "./promisesaplus.md", import.meta.url );
const markdown = await readFile( filePath, { encoding: "utf8" } );

const file = await unified()
	.use( remarkParse )
	.use( createPlugin )
	.use( remarkStringify )
	.process( markdown );

function createPlugin () {

	return tree => {

		console.log( tree );

		// Visit( tree, node => {

		// 	if ( node.type !== "heading" ) return;

		// 	console.log( node );

		// } );

	};

}

function handleHr () {}

/*
 * 核心：https://github.com/remarkjs/remark#example-support-for-gfm-and-frontmatter
 * 类型信息参考：https://github.com/syntax-tree/mdast
 * markdown AST 库：https://github.com/syntax-tree/mdast-util-from-markdown
 * mdast-util-from-markdown和mdast的区别到底是什么？
 */
