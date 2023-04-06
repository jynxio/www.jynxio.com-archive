import "@/component/jynx-ui/solid/tree";
import { HeadingNode, Props, IntFrom2To6 } from "./type";
import { marked } from "marked";
import { onMount } from "solid-js";

/* TODO: Async, highlight */
marked.setOptions( {
	renderer: new marked.Renderer(),
	gfm: true,
	xhtml: true,
	async: false,
	headerIds: true,
	headerPrefix: "heading",
} );

const headingNodes: HeadingNode[] = [];

const renderer = {
	heading ( text: string, level: number ) {

		const node: HeadingNode = { level, text, children: [] };
		const findParentNode = ( level: IntFrom2To6, headingNodes: HeadingNode[]  ): HeadingNode => {

			if ( headingNodes.length < 1 ) throw new Error( "无法插入新标题" );
			if ( level === 2 ) return headingNodes.at( - 1 ) as HeadingNode;

			const nextLevel = level - 1 as IntFrom2To6;
			const nextTree = headingNodes.at( - 1 )!.children;

			return findParentNode( nextLevel, nextTree );

		};

		switch ( level ) {

		case 1:
			headingNodes.push( node );

			break;

		case 2:
			findParentNode( level, headingNodes ).children.push( node ); // TODO
			tree.at( - 1 )!.children.push( node );
			findParent( level, tree )

			break;

		case 3:
			tree.

		default:
			throw new Error( "发现了无法处理的标题" );

		}

		console.log( level, text );

		return `<h${ level }>${ text }</h${ level }>`;

	},
};

marked.use( { renderer } );

function Markdown ( props: Props ) {

	let ref: HTMLElement;

	onMount( () => {

		ref.innerHTML = marked.parse( props.children );

	} );

	return <article ref={ ref } />;

}

export default Markdown;
