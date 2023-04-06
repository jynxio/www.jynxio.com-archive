import "@/component/jynx-ui/tree/index";

type PostArray = [ chineseName: string, englishName: string ];
type TypeArray = [ name: string, children: PostArray[] ];

function Directory ( props: { data: TypeArray[], who: [ typeIndex: number, postIndex: number ] } ) {

	const data = [
		{
			name: "JavaScript",
			children: [
				{
					name: "运算符",
				},
				{
					name: "Object在V8引擎中的实现",
				},
			],
		},
		{
			name: "CSS",
			children: [
				{
					name: "奇怪的margin",
				},
			],
		},
		{
			name: "HTML",
			children: [
				{
					name: "凑数的html文",
				},
			],
		},
	];

	return <jynx-tree data={ data } />;

}

export default Directory;
