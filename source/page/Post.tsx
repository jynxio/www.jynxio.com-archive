import style from "./Post.module.css";
import Article from "@/component/post/Article";
import Directory from "@/component/post/Directory";
import { createSignal } from "solid-js";

type Who = [ postTypeIndex: number, postInfoIndex: number ];

function Post () {

	const [ getWho, setWho ] = createSignal( [ 0, 0 ] as Who );

	return (
		<div class={ style.post }>
			<section class={ style.directory }>
				<Directory who={ getWho() } />
			</section>
			<div class={ style.article }>
				<Article who={ getWho() } />
			</div>
		</div>
	);

}

export default Post;
