import JAVASCRIPT_OPERATORS_URL from "$/post/javascript/operators.md?url";

import Article from "@/component/post/Article";
import Directory from "@/component/post/Directory";
import { createEffect, createSignal } from "solid-js";

type PostArray = [ chineseName: string, englishName: string ];
type TypeArray = [ name: string, children: PostArray[] ];

const directory: TypeArray[] = [
	[ "JavaScript", [
		[ "运算符", JAVASCRIPT_OPERATORS_URL ],
	] ],
	[ "CSS", [] ],
	[ "Data structure", [] ],
	[ "Browser", [] ],
	[ "Others", [] ],
];

function Post () {

	const [ getWho, setWho ] = createSignal( [ 0, 0 ] as [ typeIndex: number, postIndex: number ] );
	const [ getUrl, setUrl ] = createSignal( JAVASCRIPT_OPERATORS_URL );

	createEffect( () => {

		const [ typeIndex, postIndex ] = getWho();
		const url = directory[ typeIndex ][ 1 ][ postIndex ][ 1 ];

		setUrl( url );

	} );

	return (
		<div>
			<Directory who={ getWho() } data={ directory } />
			<Article url={ getUrl() } />
		</div>
	);

}

export default Post;
