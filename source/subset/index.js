// marked -> code字符 -> subset fira-code & lxgww-regu-mono -> woff2
// marked -> h1, h2, h3 -> subset lxgww-bold -> woff2
// marked -> all -> subset lxgww-regu -> woff2
const fs = require( "fs" );
const marked = require( "marked" );
const fc = require( "font-caster" );
const ttf2woff2 = require( "ttf2woff2" );

main();

async function main () {

	let allString = "";
	let codeString = "";
	let headingString = "";

	const readRes = await fc.read( "./post" );

	for ( const file of readRes.files ) {

		if ( file.name === ".DS_Store" ) continue;

		console.log( file.name );

		const { all, code, heading } = parseMarkdown( file.content );

		allString += fc.deduplication( all );
		codeString += fc.deduplication( code );
		headingString += fc.deduplication( heading );

	}

	allString = fc.deduplication( allString );
	codeString = fc.deduplication( codeString );
	headingString = fc.deduplication( headingString );

	// const subRes1 = await fc.subset( allString, "./asset/font/LXGWWenKai-Regular.ttf", "./asset/font/LXGWWenKai-Regular-subset.ttf" );
	// const subRes2 = await fc.subset( codeString, "./asset/font/FiraCode-Regular.ttf", "./asset/font/FiraCode-Regular-subset.ttf" );
	// const subRes3 = await fc.subset( codeString, "./asset/font/LXGWWenKaiMono-Regular.ttf", "./asset/font/LXGWWenKaiMono-Regular-subset.ttf" );
	// const subRes4 = await fc.subset( headingString, "./asset/font/LXGWWenKai-Bold.ttf", "./asset/font/LXGWWenKai-Bold-subset.ttf" );

	// fs.writeFileSync( "./asset/font/LXGWWenKai-Regular-subset.woff2", ttf2woff2( fs.readFileSync( "./asset/font/LXGWWenKai-Regular-subset.ttf" ) ) );
	// fs.writeFileSync( "./asset/font/FiraCode-Regular-subset.woff2", ttf2woff2( fs.readFileSync( "./asset/font/FiraCode-Regular-subset.ttf" ) ) );
	// fs.writeFileSync( "./asset/font/LXGWWenKaiMono-Regular-subset.woff2", ttf2woff2( fs.readFileSync( "./asset/font/LXGWWenKaiMono-Regular-subset.ttf" ) ) );
	// fs.writeFileSync( "./asset/font/LXGWWenKai-Bold-subset.woff2", ttf2woff2( fs.readFileSync( "./asset/font/LXGWWenKai-Bold-subset.ttf" ) ) );

	// console.log( subRes1 );
	// console.log( subRes2 );
	// console.log( subRes3 );
	// console.log( subRes4 );

}

function parseMarkdown ( text ) {

	let code = "";
	let heading = "";

	marked.use( {
		gfm: true,
		xhtml: true,
		async: false,
		renderer: {
			code: parseCode,
			codespan: parseCodespan,
			heading: parseHeading,
		},
	} );

	const all = marked.parse( text );

	return { all, code, heading };

	function parseCode ( text ) {

		code += text

		return `<pre><code>${ text }</code></pre>`

	}

	function parseCodespan ( text ) {

		code += text

		return `<code>${ text }</code>`

	}

	function parseHeading ( text, level ) {

		if ( level === 2 && text === "typora-root-url: ...." ) return ""

		heading += text;

		return `<h${ level }>${ text }</h${ level }>`;

	}

}
