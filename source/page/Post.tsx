import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import checkOs from "@/helper/checkOs";
import * as searchStore from "@/store/search";
import { Show, lazy, onCleanup, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import routerHelper from "@/helper/routerHelper";

const LazyContent = lazy( () => import( "@/component/post/Content" ) );
const LazySearch = lazy( () => import( "@/component/post/Search" ) );

function Post () {

	const params = useParams();

	onMount( () => document.addEventListener( "keydown", handleKeydown ) );
	onCleanup( () => document.removeEventListener( "keydown", handleKeydown ) );

	return (
		<div class={ style.post }>
			<section class={ style.nav }>
				<Nav />
			</section>
			<Show when={ routerHelper.post.checkPath( params.path ) }>
				<section class={ style.content }>
					<LazyContent />
				</section>
			</Show>
			<LazySearch />
		</div>
	);

	function handleKeydown ( event: KeyboardEvent ) {

		const key = event.key.toLowerCase();

		if ( key !== "escape" && key !== "k" && key !== "control" && key !== "meta" ) return;

		/* Opening && esc key => close */
		if ( searchStore.getEnabled() && key === "escape" ) return void searchStore.setEnabled( false );

		/* Combination keys => switch */
		const isPreKeyDown = checkOs() === "macOS" ? event.metaKey : event.ctrlKey;

		if ( ! isPreKeyDown ) return;

		if ( event.key.toLowerCase() !== "k" ) return;

		event.preventDefault();
		searchStore.setEnabled( prev => ! prev );

	}

}

export default Post;
