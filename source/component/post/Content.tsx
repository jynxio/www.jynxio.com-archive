import style from "./Content.module.css";
import * as postCatalogStore from "@/store/postCatalog";
import * as chapterCatalogStore from "@/store/chapterCatalog";
import { createEffect, createSignal, createUniqueId } from "solid-js";
import { marked } from "marked";

const LINK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" x2=\"21\" y1=\"14\" y2=\"3\"></line></svg>";

function Content () {

	const [ getHtml, setHtml ] = createSignal( "" );

	createEffect( () => {

		const url = postCatalogStore.getPostUrl();

		if ( url === void 0 ) {

			setHtml( "" );
			chapterCatalogStore.setData( void 0 );

			return;

		}

		fetch( url )
			.then( res => res.text() )
			.then( txt => setHtml( parseMarkdown( txt ) ) );

	} );

	return (
		<article class={ style.content } innerHTML={ getHtml() } />
	);

}

function parseMarkdown ( markdown: string ) {

	type H2Node = { name: string, uuid: string };
	type H1Node = { name: string, uuid: string, children: H2Node[] };

	marked.use( {
		gfm: true,
		xhtml: true,
		async: false,
		renderer: {
			heading: parseHeading,
			hr: parseHr,
			link: parseLink,
		},
	} );

	const chapterCatalogData = [] as H1Node[];

	let title: string | undefined;
	let html = marked.parse( markdown );

	if ( title === void 0 ) throw new Error( "Markdown format: every markdown document must have an h1 tag" );

	html = title + html;
	chapterCatalogStore.setData( chapterCatalogData );

	return html;

	function parseHeading ( text: string, level: number ) {

		const uuid = createUniqueId();

		switch ( level ) {

		case 1:
			if ( title !== void 0 ) throw new Error( "Markdown format: each markdown document only allows one h1 tag to exist" );

			title = `<h1 id="${ uuid }">${ text }</h1>`;

			return "";

		case 2:
			if ( text === "typora-root-url: ...." ) return "";

			chapterCatalogData.push( { name: text, uuid, children: [] } );

			break;

		case 3:
			chapterCatalogData.at( - 1 )!.children.push( { name: text, uuid } );

			break;

		default:
			throw new Error( "Markdown format: h4, h5, and h6 tags are not allowed" );

		}

		return `<h${ level } id="${ uuid }">${ text }</h${ level }>`;

	}

	function parseHr () {

		return "";

	}

	function parseLink ( href: string, title: string, text: string ) {

		console.log( href, title, text );

		return `<a href="${ href }" target="_blank">${ text + LINK_SVG }</a>`;

	}

}

export default Content;
