import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
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
			<Show when={ params.id.startsWith( "post" ) }>
				<section class={ style.content }>
					<LazyContent path={ params.id } />
				</section>
			</Show>
		</div>
	);

}

export default Post;
