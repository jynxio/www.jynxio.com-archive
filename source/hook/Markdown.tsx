import Props from "./type";
import { marked } from "marked";

function Markdown ( props: Props ) {

	/* Async headerIds headerPrefix highlight renderer tokenizer walkTokens xhtml */

	return <div innerHTML={ marked.parse( props.data ) } />;

}

export default Markdown;
