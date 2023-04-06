type PostArray = [ chineseName: string, englishName: string ];
type TypeArray = [ name: string, children: PostArray[] ];

function Directory ( props: { data: TypeArray[], who: [ typeIndex: number, postIndex: number ] } ) {

	return <div>directory</div>;

}

export default Directory;
