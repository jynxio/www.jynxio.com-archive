import { marked } from "marked";

type HeadingCallback = ( text: string, level: number ) => void;

interface Plugin {
	heading?: HeadingCallback[];
}

function createMarked ( plugin?: Plugin ) {

	const renderer = {
		heading: ( text: string, level: number ) => {

			plugin?.heading?.forEach( callback => callback( text, level ) );

			return `<h${ level }>${ text }</h${ level }>`;

		},
	};

	/* TODO: Async, highlight */
	marked.use( {
		renderer,
		gfm: true,
		xhtml: true,
		async: false,
		headerIds: true,
		headerPrefix: "heading",
	} );

	return marked;

}

export default createMarked;
