import style from "./Post.module.css";
import Catalogue from "@/component/post/Catalogue";
import Content from "@/component/post/Content";

function Post () {

	return (
		<div class={ style.post }>
			<section class={ style[ "post-catalogue" ] }>
				<Catalogue />
			</section>
			<section class={ style.content }>
				<Content />
			</section>
			<section class={ style[ "chapter-catalogue" ] }>
				<Catalogue />
			</section>
		</div>
	);

}

export default Post;
