import { readFile, writeFile } from "node:fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";

const filePath = new URL( "./promisesaplus.md", import.meta.url );
const markdown = await readFile( filePath, { encoding: "utf8" } );

const file = await unified()
	.use( remarkParse )
	.use( createPlugin )
	.use( remarkStringify )
	.process( markdown );

function createPlugin () {

	return tree => {

		visit( tree, node => {

			if ( node.type !== "heading" ) return;

			console.log( node );

		} );

	};

}
