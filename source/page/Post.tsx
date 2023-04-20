import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import Chapter from "@/component/post/Chapter";
import Content from "@/component/post/Content";
import Scrollbar from "@/component/common/Scrollbar";
import { onCleanup, onMount } from "solid-js";

function Post () {

	onMount( () => globalThis.addEventListener( "scroll", handleScroll ) );
	onCleanup( () => globalThis.removeEventListener( "scroll", handleScroll ) );

	// TODO

	return (
		<div class={ style.post }>
			<section class={ style.nav }>
				<Nav />
			</section>
			<section class={ style.content }>
				<Content />
			</section>
			<section class={ style.chapter }>
				<Chapter />
			</section>
			<section class={ style.scrollbar }>
				<Scrollbar display={ true } size={ 0.1 } position={ 0.5 } />
			</section>
		</div>
	);

	function handleScroll () {

		console.log( document.documentElement.offsetHeight, document.documentElement.scrollTop );

	}

}

export default Post;
