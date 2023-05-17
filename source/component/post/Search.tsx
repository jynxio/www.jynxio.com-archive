import style from "./Search.module.css";
import data from "@/asset/catalog/data.json";
import Fuse from "fuse.js";
import routerHelper from "@/helper/routerHelper";
import * as store from "@/store/search";
import { useNavigate } from "@solidjs/router";
import { For, Show, createSelector, createSignal, onCleanup, onMount } from "solid-js";

type Item = { html: string, topicName: string, postName: string };
type List = Item[];

const options = {
	includeScore: true,
	includeMatches: true,
	threshold: 0.2,
	minMatchCharLength: 1,
	keys: [ [ "children", "alias" ] ],
};
const fuse = new Fuse( data, options );

function Search () {

	let searchRef: HTMLElement | undefined;
	let inputRef: HTMLInputElement | undefined;

	const navigate = useNavigate();
	const [ getSelectedIndex, setSelectedIndex ] = createSignal( - 1 ); // -1 represents that no one has been selected
	const [ getList, setList ] = createSignal<List>( [] );
	const isSelected = createSelector( getSelectedIndex );

	onMount( () => {

		inputRef?.focus();
		document.addEventListener( "pointerdown", handleGlobalPointerDown );
		document.addEventListener( "keydown", handleKeydown );

	} );
	onCleanup( () => {

		document.removeEventListener( "pointerdown", handleGlobalPointerDown );
		document.removeEventListener( "keydown", handleKeydown );

	} );

	return (
		<Show when={ store.getEnabled() }>
			<aside class={ style.search } ref={ searchRef }>
				<section class={ style.input }>
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
					</span>
					<span>
						<input type="text" placeholder="搜索" onInput={ handleInput } ref={ inputRef }/>
					</span>
				</section>
				<Show when={ getList().length }><hr /></Show>
				<section class={ style.output }>
					<For each={ getList() }>{ ( item, getIndex ) => <p
						innerHTML={ item.html }
						classList={ { [ style.selected ]: isSelected( getIndex() ) } }
						onPointerEnter={ [ handlePointerEnter, getIndex ] }
						onPointerLeave={ [ handlePointerLeave, getIndex ] }
						onPointerDown={ [ handleLocalPointerDown, getIndex ] }
					/> }</For>
				</section>
			</aside>
		</Show>
	);

	function handleInput ( event: InputEvent ) {

		const target = event.target as HTMLInputElement;
		const data = fuse.search( target.value );
		const newList: List = createList( data );

		setList( newList );

	}

	function handleGlobalPointerDown ( event: PointerEvent ) {

		if ( ! searchRef ) return;

		const target = event.target as HTMLElement;
		const isFocus = searchRef!.contains( target );

		if ( isFocus ) return;

		store.setEnabled( false );

	}

	function handleLocalPointerDown ( getIndex: () => number ) {

		const item = getList()[ getIndex() ];

		navigate( routerHelper.post.createPath( item.topicName, item.postName ) );
		store.setEnabled( false );

	}

	function handlePointerLeave () {

		setSelectedIndex( - 1 );

	}

	function handlePointerEnter ( getIndex: () => number ) {

		setSelectedIndex( getIndex() );

	}

	function handleKeydown ( event: KeyboardEvent ) {

		if ( getList().length === 0 ) return;

		const key = event.key.toLowerCase();

		if ( key !== "arrowup" && key !== "arrowdown" && key !== "enter" ) return;

		/* Key: arrow up */
		if ( key === "arrowup" ) {

			getSelectedIndex() <= 0
				? setSelectedIndex( getList().length - 1 )
				: setSelectedIndex( prev => prev - 1 );

			return;

		}

		/* Key: arrow down */
		if ( key === "arrowdown" ) {

			setSelectedIndex( prev => ( prev + 1 ) % getList().length );

			return;

		}

		/* Key: enter */
		if ( getSelectedIndex() === - 1 ) return;

		const item = getList()[ getSelectedIndex() ];

		navigate( routerHelper.post.createPath( item.topicName, item.postName ) );
		store.setEnabled( false );

	}

}

function createList ( data: any ) {

	const list: List = [];

	for ( const { item: topic, matches } of data ) {

		if ( matches === void 0 ) continue;

		for ( const { refIndex, indices } of matches ) {

			if ( refIndex === void 0 ) continue;

			const post = topic.children[ refIndex ];
			const categoryHtml = `<span>${ topic.alias }</span>`;
			const postHtmlPrefix = "<span>";
			const postHtmlSuffix = "</span>";

			let postHtmlMiddle = "";
			let from = 0;
			let to = 0;

			for ( const index of indices ) {

				to = index[ 0 ];

				postHtmlMiddle += post.alias.slice( from, to );
				postHtmlMiddle += `<mark>${ post.alias.slice( index[ 0 ], index[ 1 ] + 1 ) }</mark>`;

				from = index[ 1 ] + 1;

			}

			postHtmlMiddle += post.alias.slice( from );

			const postHtml = postHtmlPrefix + postHtmlMiddle + postHtmlSuffix;
			const connectionHtml = "<span> - </span>";
			const html = categoryHtml + connectionHtml + postHtml;

			list.push( { html, topicName: topic.name, postName: post.name } );

		}

	}

	return list;

}

export default Search;
