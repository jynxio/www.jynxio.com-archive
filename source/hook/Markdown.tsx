import { marked } from "marked";

function Markdown ( props ) {

	console.log( marked.parse( props.data ) );

	return <></>;

}

export default Markdown;
