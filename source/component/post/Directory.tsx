type PostArray = [ chineseName: string, englishName: string ];
type TypeArray = [ name: string, children: PostArray[] ];

function Directory ( props: { data: TypeArray[], who: [ typeIndex: number, postIndex: number ] } ) {

	console.log( props.data );

	return <div>directory</div>;

}

export default Directory;
