import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import { lazy } from "solid-js";

const LazyContent = lazy( () => import( "@/component/post/Content" ) );
const LazySearch = lazy( () => import( "@/component/post/Search" ) );

function Post () {

	return (
		<div class={ style.post }>
			<section class={ style.nav }>
				<Nav />
			</section>
			<section class={ style.content }>
				<LazyContent />
			</section>
			<LazySearch />
		</div>
	);

}

export default Post;
