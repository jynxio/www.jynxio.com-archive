import style from "./File.css?raw";
import { customElement } from "solid-element";

customElement( "jynx-file", { name: "default-file" }, ( props, { element } ) => {

	return (
		<div>
			<style>{ style }</style>
			<div class="file">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
				</span>
				<span class="name">{ props.name }</span>
			</div>
		</div>
	);

} );
