import style from "./index.css?raw";
import "./File";
import "./Folder";
import { For, Show, createSignal } from "solid-js";
import { customElement } from "solid-element";

customElement( "jynx-tree", { data: [] }, ( props, { element } ) => {

	return (
		<div>
			<style>{ style }</style>
			<For each={ props.data }>{ data => recursing( data ) }</For>
		</div>
	);

	function recursing ( data: { name: string, children?: [] } ) {

		if ( ! data.children ) return <jynx-file name={ data.name } />;

		const [ getCollapsed, setCollapsed ] = createSignal( true );

		return (
			<>
				<jynx-folder name={ data.name } onClick={ () => setCollapsed( ! getCollapsed() ) } />
				<Show when={ ! getCollapsed() }>
					<div class="sub">
						<For each={ data.children }>{ data => recursing( data ) }</For>
					</div>
				</Show>
			</>
		);

	}

} );
