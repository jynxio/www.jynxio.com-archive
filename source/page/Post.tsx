import style from "./Post.module.css";
import Article from "@/component/post/Article";
import Nav from "@/component/post/Nav";

function Post () {

	return (
		<div class={ style.post }>
			<section class={ style.nav }>
				<Nav />
			</section>
			<section class={ style.article }>
				{/* <Article /> */}
			</section>
		</div>
	);

}

export default Post;
