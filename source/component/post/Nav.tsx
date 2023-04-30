import style from "./Nav.module.css";
import Theme from "@/component/common/Theme";
import catalogData from "@/asset/catalog/data.json";
import * as searchStore from "@/store/search";
import { useNavigate, useParams } from "@solidjs/router";
import { For, Show, createSelector, createSignal } from "solid-js";

function Nav () {

	return (
		<nav class={ style.nav }>
			<Search />
			<hr />
			<Catalog />
			<hr />
			<Control />
		</nav>
	);

}

function Search () {

	return (
		<section class={ style.search } onClick={ handleClick }>
			<span class={ style.icon }>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal"><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg>
			</span>
			<span class={ style.text }>搜索</span>
			<span class={ style.shortcut }>⌘ + K</span>
		</section>
	);

	function handleClick () {

		if ( searchStore.getEnabled() ) return;

		searchStore.setEnabled( true );

	}

}

function Catalog () {

	const params = useParams();
	const navigate = useNavigate();

	const isTargetTopic = createSelector( getTopicName );
	const isTargetPost = createSelector( getPostName );

	return (
		<section class={ style.catalog }>
			<For each={ catalogData }>
				{
					topic => (
						<>
							<div
								class={ style.topic }
								classList={ { [ style.selected ]: isTargetTopic( topic.name ) } }
								onClick={ [ handleTopicClick, topic.name ] }
							>
								<span class={ style.name }>{ topic.alias }</span>
								<span class={ style.icon }><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><polyline points="9 18 15 12 9 6" /></svg></span>
							</div>
							<Show when={ isTargetTopic( topic.name ) }>
								<For each={ topic.children }>
									{
										post => (
											<div
												class={ style.post }
												classList={ { [ style.selected ]: isTargetPost( post.name ) } }
												onClick={ [ handlePostClick, post.name ] }
											>
												<span class={style.name}>{ post.alias }</span>
												<data class={ style.data }>{ post.time }</data>
											</div>
										)
									}
								</For>
							</Show>
						</>
					)
				}
			</For>
		</section>
	);

	function getTopicName () {

		if ( ! params.id.startsWith( "post/" ) ) return "";

		return params.id.slice( 5, params.id.indexOf( "/", 5 ) );

	}

	function getPostName () {

		if ( ! params.id.startsWith( "post/" ) ) return "";

		return params.id.slice( params.id.indexOf( "/", 5 ) + 1 );

	}

	function handleTopicClick ( name: string ) {

		getTopicName() === name
			? navigate( "/" )
			: navigate( `/post/${ name }/${ catalogData.find( topic => topic.name === name )!.children[ 0 ].name }` );

	}

	function handlePostClick ( name: string ) {

		navigate( `/post/${ getTopicName() }/${ name }` );

	}

}

function Control () {

	const themeKey = "www.jynxio.com-theme";

	localStorage.getItem( themeKey ) || localStorage.setItem( themeKey, "dark" );

	const theme = localStorage.getItem( themeKey ) as "dark" | "light";
	const [ getTheme, setTheme ] = createSignal( theme );

	document.documentElement.setAttribute( "class", theme );

	return (
		<section class={ style.control }>
			<span class={ style.icon }>
				<a href="https://github.com/jynxio" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
				</a>
			</span>
			<span class={ style.icon }>
				<a href="https://twitter.com/jyn_xio" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
				</a>
			</span>
			<span class={ style.icon }>
				<a href="https://github.com/jynxio/www.jynxio.com" target="_blank">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
				</a>
			</span>
			<span class={ style.icon } onClick={ handleClick }>
				<Theme mode={ getTheme() } />
			</span>
		</section>
	);

	function handleClick () {

		const nextTheme = getTheme() === "dark" ? "light" : "dark";

		setTheme( nextTheme );

		document.documentElement.setAttribute( "class", nextTheme );
		localStorage.setItem( themeKey, nextTheme );

	}

}

export default Nav;
