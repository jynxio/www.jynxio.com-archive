const fs = require( "fs" );
const path = require( "path" );

main();

async function main () {

	/* 创建目录的JSON */
	const dirPromises = [];
	const rootAddress = path.resolve();
	const skeleton = JSON.parse( fs.readFileSync( rootAddress + "/source/asset/catalog/skeleton.json", "utf8" ) );

	for ( const dir of skeleton ) {

		const aliasPromises = [];
		const dirAddress = rootAddress + "/post/post/" + dir.name;
		const dirents = fs.readdirSync( dirAddress, { encoding: "utf8", withFileTypes: true } );

		dir.children = [];

		for ( const dirent of dirents ) {

			const fileAddress = dirAddress + "/" + dirent.name;

			aliasPromises.push( extractHeading( fileAddress ) );
			dir.children.push( { name: dirent.name } );

		}

		dirPromises.push( Promise.all( aliasPromises ) );

	}

	( await Promise.all( dirPromises ) ).forEach( ( aliases, index ) => {

		const children = skeleton[ index ].children;

		aliases.forEach( ( alias, index ) => {

			children[ index ].alias = alias;

		} );

	} );

	/* 写入为一个JSON文件 */
	const jsonAddress = rootAddress + "/source/asset/catalog/data.json";

	fs.writeFileSync( jsonAddress, JSON.stringify( skeleton ), { encoding: "utf8" } );

}

/**
 * （异步）提取markdown文件的标题
 * @param { string } filePath markdown文件的路径
 * @returns { Promise } 敲定值是标题字符串，拒绝值是Error实例。
 */
function extractHeading ( filePath ) {

	return new Promise( ( resolve, reject ) => {

		let string = "";

		const reader = fs.createReadStream( filePath, { encoding: "utf8", "highWaterMark": 1024 } );

		reader.on( "data", chunk => {

			string += chunk;
			reader.destroy();

		} );
		reader.on( "error", error => reject( error ) );
		reader.on( "close", () => {

			const fromIndex = string.indexOf( "# " ) + 2;
			const toIndex = string.indexOf( "\n", fromIndex );
			const heading = string.slice( fromIndex, toIndex ).trim();

			resolve( heading );

		} );

	} );

}
