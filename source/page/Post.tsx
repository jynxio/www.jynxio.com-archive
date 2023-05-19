import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import Welcome from "@/component/post/Welcome";
import { ErrorBoundary, Show, lazy } from "solid-js";
import { useParams } from "@solidjs/router";

const LazyContent = lazy( () => import( "@/component/post/Content" ) );
const LazySearch = lazy( () => import( "@/component/post/Search" ) );
const LazyMissing = lazy( () => import( "@/component/post/Missing" ) );

function Post () {

	const params = useParams();
	const getUrl = () => {

		const [ topicName, postName ] = params.path.split( "/" );

		if ( ! topicName ) return;

		if ( ! postName ) return;

		return `${ import.meta.env.BASE_URL }post/post/${ topicName }/${ postName }.md`;

	};

	return (
		<div class={ style.post }>
			<section class={ style.nav }>
				<Nav />
			</section>
			<section class={ style.content }>
				<ErrorBoundary fallback={ <LazyMissing /> }>
					<Show when={ typeof getUrl() === "string" } fallback={ <Welcome /> }>
						<LazyContent url={ getUrl() as string } />
					</Show>
				</ErrorBoundary>
			</section>
			<LazySearch />
		</div>
	);

}

export default Post;
