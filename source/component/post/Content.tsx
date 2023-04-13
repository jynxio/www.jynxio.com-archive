import * as postCatalogStore from "@/store/postCatalog";
import * as chapterCatalogStore from "@/store/chapterCatalog";
import { createEffect, createUniqueId } from "solid-js";
import { marked } from "marked";

function Content () {

	createEffect( () => {

		const url = postCatalogStore.getPostUrl();

		if ( url === void 0 ) return;

		fetch( url )
			.then( res => res.text() )
			.then( txt => parseMarkdown( txt ) );

	} );

	return <div />;

}

function parseMarkdown ( markdown: string ) {

	type H2Node = { name: string, uuid: string };
	type H1Node = { name: string, uuid: string, children: H2Node[] };

	const chapterCatalogData = [] as H1Node[];

	marked.use( {
		gfm: true,
		xhtml: true,
		async: false,
		renderer: {
			heading: parseHeading,
		},
	} );

	const html = marked.parse( markdown );

	chapterCatalogStore.setData( chapterCatalogData );

	return html;

	function parseHeading ( text: string, level: number ) {

		if ( level === 1 ) return "";

		if ( level > 3 ) throw new Error( "Markdown Error: can not process h4, h5, h6" );

		const uuid = createUniqueId();

		if ( level === 2 ) {

			const h1Node = { name: text, uuid, children: [] };

			chapterCatalogData.push( h1Node );

		}

		if ( level === 3 ) {

			const h2Node = { name: text, uuid };

			chapterCatalogData.at( - 1 )!.children.push( h2Node );

		}

		return `<h${ level } id="${ uuid }">${ text }</h${ level }>`;

	}

}

export default Content;
