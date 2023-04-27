import style from "./Chapter.module.css";
import * as store from "@/store/chapter";
import { For } from "solid-js";

function Chapter () {

	return (
		<nav class={ style.chapter }>
			<div class={ style.relative }>
				<For each={ store.get() }>
					{
						h1Node => <p class={ style.heading } onClick={ [ handleClick, h1Node.uuid ] }><span>{ h1Node.name }</span></p>
					}
				</For>
			</div>
		</nav>
	);

	function handleClick ( uuid: string ) {

		document.documentElement.scrollTo( { top: document.getElementById( uuid )!.offsetTop - 16, left: 0, behavior: "smooth" } );

	}

}

export default Chapter;
