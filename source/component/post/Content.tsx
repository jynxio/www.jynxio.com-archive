import "highlight.js/styles/github-dark.css";
import "@/component/primitive/jynxPre";
import style from "./Content.module.css";
import hljs from "highlight.js";
import * as postCatalogStore from "@/store/postCatalog";
import * as chapterCatalogStore from "@/store/chapterCatalog";
import { createEffect, createSignal, createUniqueId } from "solid-js";
import { marked } from "marked";

type H1Node = { name: string, uuid: string };
type CustomPreProps = { codeContent: string, collapseSvg: string, copySvg: string, codeData: string };

const VALID_LANGUAGES = [ "html", "css", "javascript", "typescript", "react", "json" ];

const LINK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" x2=\"21\" y1=\"14\" y2=\"3\"></line></svg>";
const COPY_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path><polyline points=\"20 6 9 17 4 12\"></polyline><line x1=\"18\" x2=\"6\" y1=\"6\" y2=\"18\"></line><line x1=\"6\" x2=\"18\" y1=\"6\" y2=\"18\"></line></svg>";
const CHECKBOX_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check-square\"><polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path></svg>";
const COLLAPSE_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-down\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";

hljs.configure( {
	languages: [ "html", "css", "javascript", "typescript", "json" ],
} );

function Content () {

	const [ getHtml, setHtml ] = createSignal( "" );

	createEffect( () => {

		const url = postCatalogStore.getPostUrl();

		setHtml( "" );
		chapterCatalogStore.setData( void 0 );
		document.documentElement.scrollTo( 0, 0 );

		if ( url === void 0 ) return;

		fetch( url )
			.then( res => res.text() )
			.then( txt => {

				const { html, chapterCatalogData } = parseMarkdown( txt );

				setHtml( html );
				chapterCatalogStore.setData( chapterCatalogData );

			} );

	} );

	return <article class={ style.content } innerHTML={ getHtml() } />;

}

function parseMarkdown ( markdown: string ) {

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

			title = `<h1>${ text }</h1>`;

			return "";

		case 2:
			if ( text === "typora-root-url: ...." ) return "";

			chapterCatalogData.push( { name: text, uuid } );

			break;

		case 3:
			break;

		default:
			throw new Error( "Markdown format: h4, h5, and h6 tags are not allowed" );

		}

		return `<h${ level } id="${ uuid }">${ text }</h${ level }>`;

	}

	function parseCode ( code: string, language: string | undefined, escaped: boolean ) {

		/* No language specified -> plain code */
		if ( language === "" || language === void 0 ) {

			const preSelf = marked.Renderer.prototype.code.apply( this, [ code, language, escaped ] ).trim();
			const codeContent = extractCodeContent( preSelf );

			return createCustomPre( {
				codeContent,
				collapseSvg: COLLAPSE_SVG,
				copySvg: COPY_SVG,
				codeData: code,
			} );

		}

		/* Invalid language specified */
		if ( ! VALID_LANGUAGES.includes( language ) ) {

			console.log( `%cMarkdown format: You have used a language (${ language }) that does not support highlighting, it has now been processed as plain code. The languages that support highlighting are: ${ VALID_LANGUAGES.join( ", " ) }`, "color: #c52922" );

			const preSelf = marked.Renderer.prototype.code.apply( this, [ code, language, escaped ] ).trim();
			const codeContent = extractCodeContent( preSelf );

			return createCustomPre( {
				codeContent,
				collapseSvg: COLLAPSE_SVG,
				copySvg: COPY_SVG,
				codeData: code,
			} );

		}

		/* Valid language specified */
		return createCustomPre( {
			codeContent: hljs.highlight( code, { language } ).value,
			collapseSvg: COLLAPSE_SVG,
			copySvg: COPY_SVG,
			codeData: code,
		} );

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

	function extractCodeContent ( preSelf: string ) {

		const startIndex = preSelf.indexOf( ">", 10 ) + 1;
		const endIndex = - 13;

		return preSelf.slice( startIndex, endIndex );

	}

	function createCustomPre ( { codeContent, collapseSvg, copySvg, codeData }: CustomPreProps ) {

		const unicodes = Array.from( codeData ).map( character => character.codePointAt( 0 ) );
		const data = unicodes.join();

		return (
			`<div class="${ style[ "custom-pre" ] }">` +
			`<jynx-pre data-code="${ data }">"` +
			"<pre slot='panel'>" +
			"<code>" + codeContent + "</code>" +
			"</pre>" +
			"<button slot='collapse-button'>" + collapseSvg + "</button>" +
			"<button slot='copy-button'>" + copySvg + "</button>" +
			"</jynx-pre>" +
			"</div>"
		);

	}

}

export default Content;
