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

		const { all, code, heading } = parseMarkdown( file.content ); // Bug: marked会把codespan中的某些符号翻译成转译字符，比如它会把>翻译成&gt;

		allString += all;
		codeString += code;
		headingString += heading;

	}

	allString = fc.deduplication( allString );
	codeString = fc.deduplication( codeString );
	headingString = fc.deduplication( headingString );

	const subRes1 = await fc.subset( allString, "./asset/font/raw/LXGWWenKai-Regular.ttf", "./asset/font/subset/LXGWWenKai-Regular.ttf" );
	const subRes2 = await fc.subset( headingString, "./asset/font/raw/LXGWWenKai-Bold.ttf", "./asset/font/subset/LXGWWenKai-Bold.ttf" );
	const subRes3 = await fc.subset( codeString, "./asset/font/raw/FiraCode-Regular.ttf", "./asset/font/subset/FiraCode-Regular.ttf" );
	const subRes4 = await fc.subset( codeString, "./asset/font/raw/LXGWWenKaiMono-Regular.ttf", "./asset/font/subset/LXGWWenKaiMono-Regular.ttf" );

	fs.writeFileSync( "./asset/font/subset/LXGWWenKai-Regular.woff2", ttf2woff2( fs.readFileSync( "./asset/font/subset/LXGWWenKai-Regular.ttf" ) ) );
	fs.writeFileSync( "./asset/font/subset/LXGWWenKai-Bold.woff2", ttf2woff2( fs.readFileSync( "./asset/font/subset/LXGWWenKai-Bold.ttf" ) ) );
	fs.writeFileSync( "./asset/font/subset/FiraCode-Regular.woff2", ttf2woff2( fs.readFileSync( "./asset/font/subset/FiraCode-Regular.ttf" ) ) );
	fs.writeFileSync( "./asset/font/subset/LXGWWenKaiMono-Regular.woff2", ttf2woff2( fs.readFileSync( "./asset/font/subset/LXGWWenKaiMono-Regular.ttf" ) ) );

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
