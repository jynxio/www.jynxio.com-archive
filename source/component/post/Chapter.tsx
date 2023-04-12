import style from "./Chapter.module.css";
import * as store from "@/store/chapterCatalog";
import { For } from "solid-js";

function Chapter () {

	return (
		<nav class={ style.chapter }>
			<For each={ store.getData() }>{
				h1Node => (
					<>
						<div class={ style.h1 }>
							<span class={ style.name }>{ h1Node.name }</span>
						</div>
						<For each={ h1Node.children }>{
							h2Node => (
								<div class={ style.h2 }>
									<span class={ style.name }>{ h2Node.name }</span>
								</div>
							)
						}</For>
					</>
				)
			}</For>
		</nav>
	);

}

export default Chapter;
