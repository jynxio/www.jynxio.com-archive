import style from "./Post.module.css";
import Catalogue from "@/component/post/Catalogue";
import Content from "@/component/post/Content";
import postCatalogData from "@/static/postCatalog.json";

function Post () {

	console.log( postCatalogData );

	return (
		<div class={ style.post }>
			<section class={ style[ "post-catalogue" ] }>
				<Catalogue data={ postCatalogData } />
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
