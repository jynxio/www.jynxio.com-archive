import postUrl from "$/post/test.md?url";
import Markdown from "@/hook/Markdown";
import { Show, createSignal } from "solid-js";

function Post () {

	const [ getMarkdown, setMarkdown ] = createSignal( "" );

	fetch( postUrl )
		.then( res => res.text() )
		.then( res => setMarkdown( res ) )
		.catch( err => console.error( err ) );

	return (
		<div>
			<Show when={ getMarkdown() !== "" } fallback={ <div>Loading...</div> }>
				<Markdown data={ getMarkdown() } />
			</Show>
		</div>
	);

}

export default Post;
