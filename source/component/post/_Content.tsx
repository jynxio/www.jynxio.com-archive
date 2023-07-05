import "highlight.js/styles/github-dark.css";
import style from "./Content.module.css";
import "@/component/primitive/jynxPre";
import hljs from "highlight.js";
import { For, Show, createResource, createUniqueId } from "solid-js";
import { useParams } from "@solidjs/router";
import { nanoid } from "nanoid";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import { parseSync } from "svgson";

type H1Node = { name: string, uuid: string };

const SVG_STRING_LINK = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" x2=\"21\" y1=\"14\" y2=\"3\"></line></svg>";
const SVG_STRING_CHECKBOX = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check-square\"><polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path></svg>";
const SVG_STRING_COPY = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path><polyline points=\"20 6 9 17 4 12\"></polyline><line x1=\"18\" x2=\"6\" y1=\"6\" y2=\"18\"></line><line x1=\"6\" x2=\"18\" y1=\"6\" y2=\"18\"></line></svg>";
const SVG_STRING_COLLAPSE = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-down\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";
const SVG_STRING_LINK_MAST = svg2mast( SVG_STRING_LINK );
const SVG_STRING_CHECKBOX_MAST = svg2mast( SVG_STRING_CHECKBOX );
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

	/* Parse */
	const codeMap = new Map();
	const chapters = [] as H1Node[];

	let title: string | undefined;
	let html = markdown2html( txt );

	// If ( title === void 0 ) throw new Error( "Markdown format: every markdown document must have an h1 tag" );

	return ( { html, chapters } );

	function markdown2html ( markdown ) {

		const mast = fromMarkdown( markdown, {
			extensions: [ gfm() ],
			mdastExtensions: [ gfmFromMarkdown() ],
		} );

		processMast( mast );

		const hast = toHast( mast );
		const html = toHtml( hast );
		let newHtml = html;

		for ( const [ k, v ] of codeMap ) {

			const from = newHtml.indexOf( k );
			const to = from + Array.from( k ).length;

			newHtml = newHtml.slice( 0, from ) + v + newHtml.slice( to );

		}

		return newHtml;

	}

	function processMast ( mast ) {

		// Data.hName, data.hProperties, data.hChildren
		( function deepTrave ( node, parent ) {

			switch ( node.type ) {

			case "heading":
				processHeadingNode( node );
				break;

			case "thematicBreak":
				processThematicBreakNode( node, parent );
				break;

			case "link":
				processLinkNode( node );
				break;

			case "image":
				processImageNode( node );
				break;

			case "listItem":
				processListItemNode( node );
				break;

			case "code":
				processCodeNode( node );
				break;

			default: break;

			}

			node.children?.forEach( child => deepTrave( child, node ) );

		} )( mast );

	}

	function processHeadingNode ( node ) {

		if ( node.depth > 3 ) throw new Error( "禁止使用超过三级的标题" );
		if ( node.children.length === 0 ) throw new Error( "禁止使用内容为空的标题" );
		if ( node.children.length > 1 ) throw new Error( "禁止在标题中编写非普通的文本" );

		if ( node.depth === 2 ) {

			if ( ! node.data ) node.data = {};
			if ( ! node.data.hProperties ) node.data.hProperties = {};
			node.data.hProperties.id = nanoid();

		}

	}

	function processThematicBreakNode ( node, parent ) {

		const index = parent.children.findIndex( child => child === node );

		if ( parent.children.length === 1 ) delete parent.children;
		else parent.children.splice( index, 1 );

	}

	function processLinkNode ( node ) {

		if ( node.children.length === 0 ) throw new Error( "禁止内容为空" );
		if ( node.children.length > 1 ) throw new Error( "禁止书写非普通文本" );

		if ( ! node.data ) node.data = {};
		if ( ! node.data.hProperties ) node.data.hProperties = {};
		if ( ! node.data.hChildren ) node.data.hChildren = [];

		node.data.hProperties.target = "_blank";
		node.data.hChildren.push( { type: "text", value: node.children[ 0 ].value } );
		node.data.hChildren.push( structuredClone( SVG_STRING_LINK_MAST ) );

	}

	function processImageNode ( node ) {

		node.url = "/post/image" + node.url;

	}

	function processListItemNode ( node ) {

		if ( node.checked === null ) return;

		const id = nanoid();

		node.children[ 0 ].children.unshift( {
			type: "root",
			data: {
				hChildren: [
					{
						type: "element",
						tagName: "input",
						properties: { id, disabled: true, type: "checkbox", checked: node.checked },
					},
					{
						type: "element",
						tagName: "label",
						properties: { for: id },
						children: [ structuredClone( SVG_STRING_CHECKBOX_MAST ) ],
					},
				],
			},
		} );
		node.checked = null;

	}

	function processCodeNode ( node ) {

		let hljsLanguage: string | undefined;

		outer:
		for ( const pair of VALID_LANGUAGES ) for ( const alias of pair[ 1 ] ) {

			if ( alias !== node.lang ) continue; // Param language: "json", "", undefined, ...

			hljsLanguage = pair[ 0 ];

			break outer;

		}

		const uuid = nanoid();
		const codeString = hljs.highlight( node.value, { language: hljsLanguage } ).value;
		const divString =
			`<div class="${ style[ "custom-pre" ] }">` +
			`<jynx-pre data-code="${ Array.from( node.value ).map( character => character.codePointAt( 0 ) ).join() }">` + // Data-code
			"<pre slot='panel'>" +
			"<code>" + codeString + "</code>" +
			"</pre>" +
			"<button slot='collapse-button'>" + SVG_STRING_COLLAPSE + "</button>" +
			"<button slot='copy-button'>" + SVG_STRING_COPY + "</button>" +
			"</jynx-pre>" +
			"</div>";

		codeMap.set( uuid, divString );
		node.type = "text";
		node.value = uuid;

		delete node.meta;
		delete node.lang;

	}

}

function svg2mast ( svgString ) {

	const json = parseSync( svgString );

	( function deepTrave ( json ) {

		json.tagName = json.name;
		json.properties = json.attributes;
		json.value && json.children.push( { type: "text", value: json.value } );

		delete json.name;
		delete json.attributes;
		delete json.value;

		if ( json.children.length === 0 ) delete json.children;

		json.children?.forEach( child => deepTrave( child ) );

	} )( json );

	return json;

}

export default Content;
