import style from "./Search.module.css";
import data from "@/asset/catalog/data.json";
import Fuse from "fuse.js";
import { For, Show, createSignal } from "solid-js";

const options = {
	includeScore: true,
	includeMatches: true,
	threshold: 0.2,
	minMatchCharLength: 1,
	keys: [ [ "children", "alias" ] ],
};
const fuse = new Fuse( data, options );

function Search () {

	type Item = { html: string, url: string };
	type List = Item[];

	const [ getList, setList ] = createSignal<List>( [] );

	/* TODO: createMemo: getList似乎变化的非常频繁 */

	return (
		<aside class={ style.search }>
			<div class={ style.panel }>
				<section class={ style.input }>
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
					</span>
					<span>
						<input type="text" placeholder="搜索" onInput={ handleInput }/>
					</span>
				</section>
				<Show when={ getList().length }><hr /></Show>
				<section class={ style.output }>
					<For each={ getList() }>{ item => <p innerHTML={ item.html } /> }</For>
				</section>
			</div>
		</aside>
	);

	function handleInput ( event: InputEvent ) {

		const target = event.target as HTMLInputElement;
		const data = fuse.search( target.value );
		const list: List = [];

		for ( const { item: category, matches } of data ) {

			if ( matches === void 0 ) continue;

			for ( const { refIndex, indices } of matches ) {

				if ( refIndex === void 0 ) continue;

				const post = category.children[ refIndex ];
				const categoryHtml = `<span class="${ style.category }">${ category.alias }</span>`;
				const postHtmlPrefix = `<span class="${ style.post }">`;
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
				const connectionHtml = `<span class="${ style.connection }"> - </span>`;
				const html = categoryHtml + connectionHtml + postHtml;
				const url = `/post/${ category.name }/${ post.name }`;

				list.push( { html, url } );

			}

		}

		setList( list );

	}

}

export default Search;
