import postDirectoryData from "@/store/directory";
import { marked } from "marked";
import { nanoid } from "nanoid";
import { Show, createEffect, createSignal } from "solid-js";

type Who = [ postTypeIndex: number, postInfoIndex: number ];
type H3Node = [ name: string, uuid: string ];
type H2Node = [ name: string, uuid: string, children: H3Node[] ];

function Article ( props: { who: Who } ) {

	const [ getHtml, setHtml ] = createSignal( "" );
	const [ getDir, setDir ] = createSignal( [] as H2Node[] );

	createEffect( () => {

		const url = postDirectoryData[ props.who[ 0 ] ][ 1 ][ props.who[ 1 ] ][ 1 ];

		createHtml( url ).then( ( [ html, headingDirectoryData ] ) => {

			setHtml( html as string );
			setDir( headingDirectoryData as H2Node[] );

		} );

	} );

	return (
		<>
			<Show when={ getHtml() } fallback={ <Loading /> }>
				<article innerHTML={ getHtml() } />
			</Show>
		</>
	);

}

function Loading () {

	return <div>Loading...</div>;

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

	return [ html, headingDirectoryData ];

	function handleHanding ( text: string, level: number ) {

		if ( level === 1 ) return `<h1>${ text }</h1>`;

		if ( level > 3 ) throw new Error( "Do not receive h4, h5, h6" );

		if ( level === 2 ) {

			const uuid = nanoid( 10 );
			const node: H2Node = [ text, uuid, [] ];

			headingDirectoryData.push( node );

			return `<h2 id="${ nanoid( 10 ) }">${ text }</h2>`;

		}

		const uuid = nanoid( 10 );
		const node: H3Node = [ text, uuid ];

		headingDirectoryData.at( - 1 )![ 2 ].push( node );

		return `<h3 id="${ nanoid( 10 ) }">${ text }</h3>`;

	}

}

export default Article;
