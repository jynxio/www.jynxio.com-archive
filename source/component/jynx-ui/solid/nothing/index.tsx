import style from "./index.css?raw";
import { createEffect, createSignal } from "solid-js";
import { customElement } from "solid-element";

customElement( "jynx-nothing", { jynxName: "" }, ( props, { element } ) => {

	const [ getCount, setCount ] = createSignal( 0 );

	createEffect( () => {

		console.log( props );

	} );

	return (
		<div>
			<style>{ style }</style>
			<button onClick={ () => setCount( prev => prev - 1 ) }>-</button>
			<span>{ getCount() }</span>
			<button onClick={ () => setCount( prev => prev + 1 ) }>+</button>
		</div>
	);

} );
