import style from "./Search.module.css";
import checkOs from "@/helper/checkOs";
import data from "@/asset/catalog/data.json";
import Fuse from "fuse.js";
import Tween from "@/helper/Tween";
import * as store from "@/store/search";
import { A } from "@solidjs/router";
import { For, Show, createEffect, createSelector, createSignal, onCleanup, onMount } from "solid-js";

type Item = { html: string, topicName: string, postName: string };
type List = Item[];

const fuse = new Fuse( data, {
	includeScore: true,
	includeMatches: true,
	threshold: 0.2,
	minMatchCharLength: 1,
	keys: [ [ "children", "alias" ] ],
} );

function Search () {

	let searchRef: HTMLHtmlElement | undefined;
	let barRef: HTMLDivElement | undefined;
	let sectionRef: HTMLElement | undefined;
	let inputRef: HTMLInputElement | undefined;

	const [ getSelectedIndex, setSelectedIndex ] = createSignal( - 1 ); // -1 represents that no one has been selected
	const [ getList, setList ] = createSignal<List>( [] );
	const isSelected = createSelector( getSelectedIndex );

	const fadeIn = ( percentage: number ) => {

		searchRef && searchRef.style.setProperty( "opacity", String( easeOutBack( percentage ) ) );
		barRef && barRef.style.setProperty( "transform", `translateX(-50%) scale(${ 1.1 - 0.1 * easeOutBack( percentage ) })` );

	};
	const fadeOut = ( percentage: number ) => {

		searchRef && searchRef.style.setProperty( "opacity", String( 1 - easeOutBack( percentage ) ) );
		barRef && barRef.style.setProperty( "transform", `translateX(-50%) scale(${ 1 + 0.1 * easeOutBack( percentage ) })` );

	};
	const tween = new Tween().setDuration( 300 );

	onMount( () => {

		document.addEventListener( "pointerdown", handleClose );
		document.addEventListener( "keydown", handleShortcut );
		document.addEventListener( "keydown", handleSwitch );

	} );
	onCleanup( () => {

		document.removeEventListener( "pointerdown", handleClose );
		document.removeEventListener( "keydown", handleShortcut );
		document.removeEventListener( "keydown", handleSwitch );

	} );
	createEffect( () => {

		/* TODO: fadeOut、代码结构 */

		if ( store.getEnabled() ) {

			tween.reset();
			tween.removeEventListener( "update", fadeOut );
			tween.addEventListener( "update", fadeIn );
			tween.play();

		} else {

			tween.reset();
			tween.removeEventListener( "update", fadeIn );
			tween.addEventListener( "update", fadeOut );
			tween.play();

		}

		store.getEnabled() && inputRef?.focus();

	} );

	return (
		<Show when={ store.getEnabled() }>
			<aside class={ style.search } ref={ searchRef }>
				<div class={ style.bar } ref={ barRef }>
					<section class={ style.input }>
						<span>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
						</span>
						<span>
							<input type="text" placeholder="搜索" onInput={ handleInput } ref={ inputRef }/>
						</span>
					</section>
					<Show when={ getList().length }><hr /></Show>
					<section class={ style.output } ref={ sectionRef }>
						<For each={ getList() }>{ ( item, getIndex ) => <A
							href={ `/${ item.topicName }/${ item.postName }` }
							class={ style.link }
							innerHTML={ item.html }
							classList={ { [ style.selected ]: isSelected( getIndex() ) } }
							onPointerEnter={ [ handleHover, getIndex ] }
							onPointerLeave={ [ handleBlur, getIndex ] }
							onPointerDown={ [ handleNavigate, getIndex ] }
						/> }</For>
					</section>
				</div>
			</aside>
		</Show>
	);

	function handleInput ( event: InputEvent ) {

		const target = event.target as HTMLInputElement;
		const data = fuse.search( target.value );
		const newList: List = createList( data );

		setList( newList );

	}

	function handleClose ( event: PointerEvent ) {

		if ( ! barRef ) return;

		const target = event.target as HTMLElement;
		const isFocus = barRef.contains( target );

		if ( isFocus ) return;

		store.setEnabled( false );

	}

	function handleNavigate ( getIndex: () => number ) {

		store.setEnabled( false );

	}

	function handleBlur () {

		setSelectedIndex( - 1 );

	}

	function handleHover ( getIndex: () => number ) {

		setSelectedIndex( getIndex() );

	}

	function handleSwitch ( event: KeyboardEvent ) {

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

		const link = sectionRef?.children[ getSelectedIndex() ] as HTMLLinkElement;

		link.click();
		store.setEnabled( false );

	}

	function handleShortcut ( event: KeyboardEvent ) {

		const key = event.key.toLowerCase();

		if ( key !== "escape" && key !== "k" && key !== "control" && key !== "meta" ) return;

		/* Opening && esc key => close */
		if ( store.getEnabled() && key === "escape" ) return void store.setEnabled( false );

		/* Combination keys => switch */
		const isPreKeyDown = checkOs() === "macOS" ? event.metaKey : event.ctrlKey;

		if ( ! isPreKeyDown ) return;

		if ( event.key.toLowerCase() !== "k" ) return;

		event.preventDefault();
		store.setEnabled( prev => ! prev );

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

function easeOutBack ( x: number ) {

	const c1 = 1.70158;
	const c3 = c1 + 1;

	return 1 + c3 * ( x - 1 ) ** 3 + c1 * ( x - 1 ) ** 2;

}

export default Search;
