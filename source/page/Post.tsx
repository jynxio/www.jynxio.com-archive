import Article from "@/component/post/Article";
import Loading from "@/component/post/Loading";
import { Show } from "solid-js";

function Post () {

	return (
		<div>
			<Show when={ getMarkdown() !== "" } fallback={ <Loading /> }>
				<Article />
			</Show>
		</div>
	);

}

export default Post;
