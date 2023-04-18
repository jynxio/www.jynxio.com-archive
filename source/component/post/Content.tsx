import "highlight.js/styles/github-dark.css";
import style from "./Content.module.css";
import hljs from "highlight.js";
import * as postCatalogStore from "@/store/postCatalog";
import * as chapterCatalogStore from "@/store/chapterCatalog";
import { createEffect, createSignal, createUniqueId } from "solid-js";
import { marked } from "marked";

const VALID_LANGUAGES = [ "html", "css", "javascript", "typescript", "react", "json" ];
const LINK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" x2=\"21\" y1=\"14\" y2=\"3\"></line></svg>";
const CHECKBOX_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check-square\"><polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path></svg>";

hljs.configure( {
	languages: [ "html", "css", "javascript", "typescript", "json" ],
} );

function Content () {

	const [ getHtml, setHtml ] = createSignal( "" );

	createEffect( () => {

		const url = postCatalogStore.getPostUrl();

		setHtml( "" );
		chapterCatalogStore.setData( void 0 );
		document.documentElement.scrollTo( 0, 0 ); // TODO

		if ( url === void 0 ) return;

		fetch( url )
			.then( res => res.text() )
			.then( txt => {

				const { html, chapterCatalogData } = parseMarkdown( txt );

				setHtml( html );
				chapterCatalogStore.setData( chapterCatalogData ); // Note: setData必须发生在setHtml之后

			} );

	} );

	return <article class={ style.content } innerHTML={ getHtml() } />;

}

function parseMarkdown ( markdown: string ) {

	type H2Node = { name: string, uuid: string };
	type H1Node = { name: string, uuid: string, children: H2Node[] };

	marked.use( {
		gfm: true,
		xhtml: true,
		async: false,
		renderer: {
			hr: parseHr,
			heading: parseHeading,
			listitem: parseListItem,
			code: parseCode,
			link: parseLink,
			checkbox: parseCheckbox,
		},
	} );

	const chapterCatalogData = [] as H1Node[];

	let title: string | undefined;
	let html = marked.parse( markdown );

	if ( title === void 0 ) throw new Error( "Markdown format: every markdown document must have an h1 tag" );

	html = title + html;

	return ( { html, chapterCatalogData } );

	function parseHr () {

		return "";

	}

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

	function parseCode ( code: string, language: string | undefined, escaped: boolean ) {

		/* No language specified -> plain code */
		if ( language === "" || language === void 0 ) return marked.Renderer.prototype.code.apply( this, [ code, language, escaped ] );

		/* Invalid language specified */
		if ( ! VALID_LANGUAGES.includes( language ) ) {

			console.log( `%cMarkdown format: You have used a language (${ language }) that does not support highlighting, it has now been processed as plain code. The languages that support highlighting are: ${ VALID_LANGUAGES.join( ", " ) }`, "color: #c52922" );

			return marked.Renderer.prototype.code.apply( this, [ code, language, escaped ] );

		}

		/* Valid language specified */
		return `<pre><code>${ hljs.highlight( code, { language } ).value }</code></pre>`;

	}

	function parseLink ( href: string, title: string, text: string ) {

		return `<a href="${ href }" target="_blank">${ text + LINK_SVG }</a>`;

	}

	function parseListItem ( text: string, isCheckbox: boolean, isChecked: boolean ) {

		if ( ! isCheckbox ) return `<li>${ text }</li>`;

		const checked = isChecked ? style.checked : "";

		return `<li class="${ style.checkbox + " " + checked }">${ text }</li>`;

	}

	function parseCheckbox ( isChecked: boolean ) {

		const id = createUniqueId();
		const checked = isChecked ? "checked" : "";

		return `<input id="${ id }" type="checkbox" ${ checked } disabled /><label for="${ id }">${ CHECKBOX_SVG }</label>`;

	}

}

export default Content;
