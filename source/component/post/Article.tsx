import style from "./Article.module.css";
import { getUrl } from "@/static/directory";
import { marked } from "marked";
import { Show, createResource, createUniqueId } from "solid-js";

type H3Node = { name: string, type: "h3-node", uuid: string };
type H2Node = { name: string, type: "h2-node", uuid: string, children: H3Node[] };

function Article () {

	const [ getHtml ] = createResource( getUrl, createHtml );

	return (
		<main class={ style.main }>
			<header class={ style.header } />
			<Show when={ getHtml() }>
				<article class={ style.article } innerHTML={ getHtml() } />
			</Show>
			<footer class={ style.footer }/>
		</main>
	);

}

async function createHtml ( url: string ) {

	const headingDirectoryData = [] as H2Node[];

	marked.use( {
		async: true,
		xhtml: true,
		renderer: {
			heading: handleHanding,
		},
	} );

	const res = await fetch( url );
	const markdown = await res.text();
	const html = await marked.parse( markdown );

	return html;

	function handleHanding ( text: string, level: number ) {

		if ( level === 1 ) return "";

		if ( level > 3 ) throw new Error( "Do not process h4, h5, h6" );

		if ( level === 2 ) {

			const uuid = createUniqueId();
			const node: H2Node = { name: text, type: "h2-node", uuid, children: [] };

			headingDirectoryData.push( node );

			return `<h2 id="${ uuid }">${ text }</h2>`;

		}

		const uuid = createUniqueId();
		const node: H3Node = { name: text, type: "h3-node", uuid };

		headingDirectoryData.at( - 1 )!.children.push( node );

		return `<h3 id="${ uuid }">${ text }</h3>`;

	}

}

export default Article;
