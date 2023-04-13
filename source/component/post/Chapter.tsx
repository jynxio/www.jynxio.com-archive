import style from "./Chapter.module.css";
import * as store from "@/store/chapterCatalog";
import { For, createSelector } from "solid-js";

function Chapter () {

	const isTargetChapter = createSelector( store.getChapter );

	return (
		<nav class={ style.chapter }>
			<For each={ store.getData() }>{
				h1Node => (
					<>
						<div class={ style.h1 } classList={ { [ style.selected ]: isTargetChapter( h1Node.uuid ) } } onClick={ [ handleClick, h1Node.uuid ] }>
							<span class={ style.icon }>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-1">
									<path d="M4 12h8" /><path d="M4 18V6" />
									<path d="M12 18V6" />
									<path d="m17 12 3-2v8" />
								</svg>
							</span>
							<span class={ style.name }>{ h1Node.name }</span>
						</div>
						<For each={ h1Node.children }>{
							h2Node => (
								<div class={ style.h2 } classList={ { [ style.selected ]: isTargetChapter( h2Node.uuid ) } } onClick={ [ handleClick, h2Node.uuid ] }>
									<span class={ style.icon }>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heading-2">
											<path d="M4 12h8" />
											<path d="M4 18V6" />
											<path d="M12 18V6" />
											<path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
										</svg>
									</span>
									<span class={ style.name }>{ h2Node.name }</span>
								</div>
							)
						}</For>
					</>
				)
			}</For>
		</nav>
	);

	function handleClick ( uuid: string ) {

		store.setChapter( uuid );

	}

}

export default Chapter;
