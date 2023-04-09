import TYPE_1_1_URL from "$/post/type-1-1.md?url";
import TYPE_1_2_URL from "$/post/type-1-2.md?url";
import TYPE_1_3_URL from "$/post/type-1-3.md?url";
import TYPE_2_1_URL from "$/post/type-2-1.md?url";
import TYPE_2_2_URL from "$/post/type-2-2.md?url";
import TYPE_2_3_URL from "$/post/type-2-3.md?url";
import TYPE_3_1_URL from "$/post/type-3-1.md?url";
import TYPE_3_2_URL from "$/post/type-3-2.md?url";
import TYPE_3_3_URL from "$/post/type-3-3.md?url";

import { createSignal } from "solid-js";

type PostNode = { name: string, type: "post", url: string };
type TypeNode = { name: string, type: "type", children: PostNode[] };

const data: TypeNode[] = [
	{
		name: "Type-1",
		type: "type",
		children: [
			{
				name: "Post-1-1",
				type: "post",
				url: TYPE_1_1_URL,
			},
			{
				name: "Post-1-2",
				type: "post",
				url: TYPE_1_2_URL,
			},
			{
				name: "Post-1-3",
				type: "post",
				url: TYPE_1_3_URL,
			},
		],
	},
	{
		name: "Type-2",
		type: "type",
		children: [
			{
				name: "Post-2-1",
				type: "post",
				url: TYPE_2_1_URL,
			},
			{
				name: "Post-2-2",
				type: "post",
				url: TYPE_2_2_URL,
			},
			{
				name: "Post-2-3",
				type: "post",
				url: TYPE_2_3_URL,
			},
		],
	},
	{
		name: "Type-3",
		type: "type",
		children: [
			{
				name: "Post-3-1",
				type: "post",
				url: TYPE_3_1_URL,
			},
			{
				name: "Post-3-2",
				type: "post",
				url: TYPE_3_2_URL,
			},
			{
				name: "Post-3-3",
				type: "post",
				url: TYPE_3_3_URL,
			},
		],
	},
];

const [ getWho, setWho ] = createSignal( [ 0, 0 ] as [ typeIndex: number, postIndex: number ] );

function getData () {

	return data;

}

function getUrl () {

	const [ typeIndex, postIndex ] = getWho();

	const typeNode = getData()[ typeIndex ];
	const postNode = typeNode.children[ postIndex ];

	return postNode.url;

}

export { getData, getUrl, getWho, setWho };
