import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import Search from "@/component/post/Search";
import { Show, lazy } from "solid-js";
import { useParams } from "@solidjs/router";

const LazyContent = lazy( () => import( "@/component/post/Content" ) );

function Post () {

	const params = useParams();

	return (
		<div class={ style.post }>
			<section class={ style.nav }>
				<Nav />
			</section>
			<section class={ style.content }>
				<Show when={ params.id.startsWith( "post" ) }><LazyContent path={ params.id } /></Show>
			</section>
			<Search/>
		</div>
	);

}

export default Post;
