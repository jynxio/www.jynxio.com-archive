import JAVASCRIPT_OPERATORS_URL from "$/post/javascript/operators.md?url";

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
				url: JAVASCRIPT_OPERATORS_URL,
			},
			{
				name: "Post-1-2",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
			{
				name: "Post-1-3",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
		],
	},
	{
		name: "Type-1",
		type: "type",
		children: [
			{
				name: "Post-2-1",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
			{
				name: "Post-2-2",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
			{
				name: "Post-2-3",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
		],
	},
	{
		name: "Type-1",
		type: "type",
		children: [
			{
				name: "Post-3-1",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
			{
				name: "Post-3-2",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
			{
				name: "Post-3-3",
				type: "post",
				url: JAVASCRIPT_OPERATORS_URL,
			},
		],
	},
];

export default data;
