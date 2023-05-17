import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import { Show, lazy } from "solid-js";
import { useParams } from "@solidjs/router";
import routerHelper from "@/helper/routerHelper";

const LazyContent = lazy( () => import( "@/component/post/Content" ) );
const LazySearch = lazy( () => import( "@/component/post/Search" ) );

function Post () {

	const params = useParams();

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

}

export default Post;
