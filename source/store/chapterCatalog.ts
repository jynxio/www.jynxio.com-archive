import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";

type H2Node = { name: string, uuid: string };
type H1Node = { name: string, uuid: string, children: H2Node[] };

const headingMap = new Map<string, boolean>();
const observer = new IntersectionObserver( observe, { threshold: 1 } );
const [ store, setStore ] = createStore( {
	data: [] as H1Node[] | undefined,
	target: void 0 as string | undefined,
} );

createEffect( () => {

	headingMap.clear();
	observer.disconnect();

	getData()?.forEach( h1Node => {

		headingMap.set( h1Node.uuid, false );
		observer.observe( document.getElementById( h1Node.uuid )! );

		h1Node.children.forEach( h2Node => {

			headingMap.set( h2Node.uuid, false );
			observer.observe( document.getElementById( h2Node.uuid )! );

		} );

	} );

} );

function observe ( entries: IntersectionObserverEntry[] ) {

	entries.forEach( entry => {

		const { isIntersecting, target } = entry;

		headingMap.set( target.getAttribute( "id" )!, isIntersecting );

	} );

	const headings = Array.from( headingMap.entries() );

	for ( let i = 0; i < headings.length; i ++ ) {

		const [ uuid, currentVisible ] = headings[ i ];
		const nextVisible = headings[ i + 1 ]?.[ 1 ];

		if ( ! currentVisible ) continue;

		if ( nextVisible ) continue;

		setChapter( uuid );

		break;

	}

}

function getData () {

	return store.data;

}

function setData ( data: H1Node[] | undefined ) {

	setStore( { data, target: data?.[ 0 ].uuid } );

}

function getChapter () {

	return store.target;

}

function setChapter ( uuid: string | undefined ) {

	setStore( "target", uuid );

}

export { getData, setData, getChapter, setChapter };
