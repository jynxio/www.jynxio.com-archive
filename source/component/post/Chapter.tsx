import style from "./Chapter.module.css";
import * as store from "@/store/chapterCatalog";
import { For } from "solid-js";

function Chapter () {

	return (
		<nav class={ style.chapter }>
			<div class={ style.relative }>
				<For each={ store.getData() }>
					{
						h1Node => <p class={ style.heading } onClick={ [ handleClick, h1Node.uuid ] }>{ h1Node.name }</p>
					}
				</For>
			</div>
		</nav>
	);

	function handleClick ( uuid: string ) {

		/*
		 * Document.getElementById( uuid )!.scrollIntoView( { behavior: "smooth", block: "start" } );
		 * console.log( document.getElementById( uuid )!.offsetTop );
		 */
		document.documentElement.scrollTo( { top: document.getElementById( uuid )!.offsetTop - 16, left: 0, behavior: "smooth" } );

	}

}

export default Chapter;
