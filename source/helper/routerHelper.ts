const helper = {
	post: {
		checkPath ( path: string ) {

			const items = path.split( "/" );

			if ( items.length !== 3 ) return false;

			if ( items[ 0 ] !== "post" ) return false;

			if ( items[ 1 ] === "" ) return false;

			if ( items[ 2 ] === "" ) return false;

			return true;

		},
		parsePath ( path: string ) {

			const [ , topicName, postName ] = path.split( "/" );

			return { topicName, postName };

		},
		createPath ( topicName: string, postName: string ) {

			return `/post/${ topicName }/${ postName }`;

		},
	},
};

export default helper;
