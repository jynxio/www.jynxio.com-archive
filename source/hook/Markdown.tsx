import { MarkdownProps } from "./type";
import { marked } from "marked";

function Markdown ( props: MarkdownProps ) {

	/* Async headerIds headerPrefix highlight renderer tokenizer walkTokens xhtml */

	const renderer = {
		html ( html: string ) {

			console.log( html );
			console.log( "--------------" );

			return "";

		},
	};

	marked.use( { renderer } );
	console.log( marked.parse( props.data ) );

	return <></>;

}

export default Markdown;
