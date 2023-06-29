import "highlight.js/styles/github-dark.css";
import style from "./Content.module.css";
import "@/component/primitive/jynxPre";
import hljs from "highlight.js";
import { For, Show, createResource, createUniqueId } from "solid-js";
import { marked } from "marked";
import { useParams } from "@solidjs/router";

type H1Node = { name: string, uuid: string };
type CustomPreProps = { codeContent: string, collapseSvg: string, copySvg: string, codeData: string };

const LINK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" x2=\"21\" y1=\"14\" y2=\"3\"></line></svg>";
const COPY_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path><polyline points=\"20 6 9 17 4 12\"></polyline><line x1=\"18\" x2=\"6\" y1=\"6\" y2=\"18\"></line><line x1=\"6\" x2=\"18\" y1=\"6\" y2=\"18\"></line></svg>";
const CHECKBOX_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check-square\"><polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path></svg>";
const COLLAPSE_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-down\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
const VALID_LANGUAGES = [
	[ "html", [ "html", "xml", "xhtml", "svg" ] ],
	[ "javascript", [ "javascript", "js", "mjs", "jsx" ] ],
	[ "typescript", [ "typescript", "ts", "mts", "tsx", "react", "solid" ] ],
	[ "json", [ "json" ] ],
	[ "css", [ "css" ] ],
] as const;

hljs.configure( {
	languages: [ "html", "css", "javascript", "typescript", "json" ],
} );

function Content () {

	const params = useParams();
	const getUrl = () => {

		const [ topicName, postName ] = params.path.split( "/" );

		if ( ! topicName ) return;

		if ( ! postName ) return;

		return `${ import.meta.env.BASE_URL }post/post/${ topicName }/${ postName }.md`;

	};
	const [ getData ] = createResource( getUrl, createMarkdown );

	return (
		<div>
			<Welcome display={ typeof getUrl() === "undefined" } />
			<Loading display={ typeof getUrl() === "string" && getData.loading } />
			<Missing display={ typeof getUrl() === "string" && ! getData.loading && ! getData() } />
			<Reading display={ typeof getUrl() === "string" && ! getData.loading && Boolean( getData() ) } data={ getData() } />
		</div>
	);

}

function Welcome ( props: { display: boolean } ) {

	return <div style={ { display: props.display ? void 0 : "none" } } class={ style.welcome }>:P</div>;

}

function Missing ( props: { display: boolean } ) {

	return <div style={ { display: props.display ? void 0 : "none" } } class={ style.missing }>xP</div>;

}

function Loading ( props: { display: boolean } ) {

	return (
		<aside style={ { display: props.display ? void 0 : "none" } } class={ style.loading }>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
		</aside>
	);

}

function Reading ( props: { display: boolean; data?: { html: string, chapters: H1Node[] } } ) {

	return (
		<Show when={ props.display } >
			<div style={ { display: props.display ? void 0 : "none" } } class={ style.reading }>
				<article class={ style.article } innerHTML={ props.data!.html } />
				<aside class={ style.catalog }>
					<For each={ props.data!.chapters }>
						{
							h1Node => <p class={ style.heading } onClick={ [ handleClick, h1Node.uuid ] }><span>{ h1Node.name }</span></p>
						}
					</For>
				</aside>
			</div>
		</Show>
	);

	function handleClick ( uuid: string ) {

		document.documentElement.scrollTo( { top: document.getElementById( uuid )!.offsetTop - 16, left: 0, behavior: "smooth" } );

	}

}

async function createMarkdown ( url: string ) {

	/* Fetch */
	const res = await fetch( url );

	if ( ! res.ok ) return;

	/* Parse */
	const txt = await res.text();

	/* Configuration */
	marked.use( {
		gfm: true,
		xhtml: false,
		mangle: false,
		headerIds: false,
		async: true,
		renderer: {
			hr: parseHr,
			heading: parseHeading,
			listitem: parseListItem,
			code: parseCode,
			link: parseLink,
			checkbox: parseCheckbox,
			image: parseImage,
		},
	} );

	/* Parse */
	const chapters = [] as H1Node[];

	let title: string | undefined;
	let html = await marked.parse( txt );

	if ( title === void 0 ) throw new Error( "Markdown format: every markdown document must have an h1 tag" );

	return ( { html, chapters } );

	function parseHr () {

		return "";

	}

	function parseHeading ( text: string, level: number ) {

		const uuid = createUniqueId();

		switch ( level ) {

		case 1:
			if ( title !== void 0 ) throw new Error( "Markdown format: each markdown document only allows one h1 tag to exist" );

			title = `<h1>${ text }</h1>`;

			return title;

		case 2:
			if ( text.includes( "typora-root-url:" ) ) return "";

			chapters.push( { name: text.replace( /&#39;/g, "'" ), uuid } ); // BUG：replace方法用于处理转义字符，但是此处只处理了&#39;

			break;

		case 3:
			break;

		default:
			throw new Error( "Markdown format: h4, h5, and h6 tags are not allowed" );

		}

		return `<h${ level } id="${ uuid }">${ text }</h${ level }>`;

	}

	function parseCode ( code: string, language: string | undefined, escaped: boolean ) {

		/* Invalid language specified || No language specified */
		let hljsLanguage: string | undefined;

		outer:
		for ( const pair of VALID_LANGUAGES ) for ( const alias of pair[ 1 ] ) {

			if ( alias !== language ) continue; // Param language: "json", "", undefined, ...

			hljsLanguage = pair[ 0 ];

			break outer;

		}

		if ( ! hljsLanguage ) {

			console.log( `%cMarkdown format: You have not specified a language type or the language type you specified is not supported by hljs, so your code can only be rendered as plain code.\nThe language you specified is: ${ language }`, "color: #c52922" );

			return createCustomPre( {
				codeContent: code,
				collapseSvg: COLLAPSE_SVG,
				copySvg: COPY_SVG,
				codeData: code,
			} );

		}

		/* Valid language specified */
		return createCustomPre( {
			codeContent: hljs.highlight( code, { language: hljsLanguage } ).value,
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

	function parseImage ( href: string, title: string, text: string ) {

		const baseUrl = import.meta.env.BASE_URL;
		const url = `${ baseUrl }post/image${ href }`;

		return `<img src="${ url }" alt="${ text }" />`;

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
