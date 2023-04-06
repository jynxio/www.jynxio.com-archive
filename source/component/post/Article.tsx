import { marked } from "marked";
import { nanoid } from "nanoid";
import { Show, createEffect, createSignal } from "solid-js";

type SecondLevelNode = [ text: string, uuid: string ];
type FirstLevelNode = [ text: string, uuid: string, children: SecondLevelNode[] ];

function Article ( props: { url: string } ) {

	const [ getHtml, setHtml ] = createSignal( "" );
	const [ getDir, setDir ] = createSignal( [] as FirstLevelNode[] );

	createEffect( () => {

		if ( ! props.url ) return;

		createHtml( props.url ).then( ( [ html, dir ] ) => {

			setHtml( html as string );
			setDir( dir as FirstLevelNode[] );

		} );

	} );

	return (
		<>
			<Show when={ getHtml() } fallback={ <Loading /> }>
				<article innerHTML={ getHtml() } />
				<Directory data={ getDir() } />
			</Show>
		</>
	);

}

function Loading () {

	return <div>Loading...</div>;

}

function Directory ( props: { data: FirstLevelNode[] } ) {

	return <div>directory</div>;

}

async function createHtml ( url: string ) {

	const dir = [] as FirstLevelNode[];

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

	return [ html, dir ];

	function handleHanding ( text: string, level: number ) {

		if ( level === 1 ) return `<h1>${ text }</h1>`;

		if ( level > 3 ) throw new Error( "Do not receive h4, h5, h6" );

		if ( level === 2 ) {

			const uuid = nanoid( 10 );
			const node: FirstLevelNode = [ text, uuid, [] ];

			dir.push( node );

			return `<h2 id="${ nanoid( 10 ) }">${ text }</h2>`;

		}

		const uuid = nanoid( 10 );
		const node: SecondLevelNode = [ text, uuid ];

		dir.at( - 1 )![ 2 ].push( node );

		return `<h3 id="${ nanoid( 10 ) }">${ text }</h3>`;

	}

}

export default Article;
