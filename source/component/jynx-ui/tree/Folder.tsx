import style from "./Folder.css?raw";
import { customElement } from "solid-element";

customElement( "jynx-folder", { name: "default-folder" }, ( props, { element } ) => {

	return (
		<div>
			<style>{ style }</style>
			<div class="folder">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
				</span>
				<span class="name">{ props.name }</span>
			</div>
		</div>
	);

} );
