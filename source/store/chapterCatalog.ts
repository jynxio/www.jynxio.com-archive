import { createStore } from "solid-js/store";

type H2Node = { name: string, uuid: string };
type H1Node = { name: string, uuid: string, children: H2Node[] };

const [ store, setStore ] = createStore( {
	data: [] as H1Node[] | undefined,
	target: void 0 as string | undefined,
} );

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
