import style from "./Post.module.css";
import Nav from "@/component/post/Nav";
import Chapter from "@/component/post/Chapter";
import Content from "@/component/post/Content";
import { inject } from "@vercel/analytics";

inject();

function Post () {

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
		</div>
	);

}

export default Post;
