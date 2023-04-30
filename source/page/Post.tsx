import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import * as searchStore from "@/store/search";
import { Show, lazy, onCleanup, onMount } from "solid-js";
import { useParams } from "@solidjs/router";

const LazyContent = lazy( () => import( "@/component/post/Content" ) );
const LazySearch = lazy( () => import( "@/component/post/Search" ) );

function Post () {

	const params = useParams();

	onMount( () => document.addEventListener( "keydown", handleKeyboard ) );
	onCleanup( () => document.removeEventListener( "keydown", handleKeyboard ) );

	return (
		<div class={ style.post }>
			<section class={ style.nav }>
				<Nav />
			</section>
			<section class={ style.content }>
				<Show when={ params.id.startsWith( "post" ) }><LazyContent path={ params.id } /></Show>
			</section>
			<Show when={ searchStore.getEnabled() }><LazySearch/></Show>
		</div>
	);

	function handleKeyboard ( event: KeyboardEvent ) {

		/* 当Search bar处于开启状态 */
		if ( searchStore.getEnabled() ) {

			if ( event.key.toLowerCase() !== "escape" ) return;

			return void searchStore.setEnabled( false );

		}

		/* 当Search bar处于关闭状态 */
		if ( ! event.metaKey ) return;

		if ( event.key.toLowerCase() !== "k" ) return;

		searchStore.setEnabled( true );

	}

}

export default Post;
