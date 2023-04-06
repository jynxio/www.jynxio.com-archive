import "@/component/jynx-ui/tree";
import createMarked from "./helper/createMarked";
import { onMount } from "solid-js";

type HeadingCallback = ( text: string, level: number ) => void;

interface Props {
	data: string;
	plugin?: {
		heading?: HeadingCallback[];
	};
}

function Markdown ( props: Props ) {

	let ref: HTMLElement;

	onMount( () => {

		ref.innerHTML = createMarked( props.plugin ).parse( props.data );

	} );

	return <article ref={ ref } />;

}

export default Markdown;
