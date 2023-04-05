import "@/component/jynx-ui/solid/tree";
import Props from "./type";
import { marked } from "marked";

function Markdown ( props: Props ) {

	/* TODO: innerHTML={ createHtml() } */
	/* TODO: Async headerIds headerPrefix highlight renderer tokenizer walkTokens xhtml */

	marked.setOptions( {
		renderer: new marked.Renderer(),
		gfm: true,
		xhtml: true,
		async: false, // TODO
		headerIds: true,
		headerPrefix: "heading",
	} );

	const treeData = [
		{
			name: "folder-1",
			children: [
				{
					name: "folder-1-1",
					children: [
						{
							name: "file-1-1-1",
						},
						{
							name: "file-1-1-2",
						},
					],
				},
				{
					name: "file-1-2",
				},
			],
		},
		{
			name: "folder-2",
			children: [],
		},
	];

	return (
		<article>
			<jynx-tree data={ treeData }/>
		</article>
	);

	function createHtml () {

		const result = marked.parse( props.data );

		return result;

	}

}

export default Markdown;
