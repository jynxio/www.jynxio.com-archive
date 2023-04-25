const fs = require( "fs" );
const path = require( "path" );
const marked = require( "marked" );
const fc = require( "font-caster" );
const ttf2woff2 = require( "ttf2woff2" );

main();

const ROOT_PATH = path.resolve();
const PROCESS_DIR_PATH = ROOT_PATH + "/source/asset/font/process";

const RAW_TTF_LXGW_BOLD_PATH = ROOT_PATH + "/source/asset/font/raw/LXGWWenKai-Bold.ttf";
const RAW_TTF_LXGW_REGULAR_PATH = ROOT_PATH + "/source/asset/font/raw/LXGWWenKai-Regular.ttf";
const RAW_TTF_FIRACODR_REGULAR_PATH = ROOT_PATH + "/source/asset/font/raw/FiraCode-Regular.ttf";
const RAW_TTF_LXGWMONO_REGULAR_PATH = ROOT_PATH + "/source/asset/font/raw/LXGWWenKaiMono-Regular.ttf";

const PROCESS_TTF_LXGW_BOLD_PATH = ROOT_PATH + "/source/asset/font/process/LXGWWenKai-Bold.ttf";
const PROCESS_TTF_LXGW_REGULAR_PATH = ROOT_PATH + "/source/asset/font/process/LXGWWenKai-Regular.ttf";
const PROCESS_TTF_FIRACODR_REGULAR_PATH = ROOT_PATH + "/source/asset/font/process/FiraCode-Regular.ttf";
const PROCESS_TTF_LXGWMONO_REGULAR_PATH = ROOT_PATH + "/source/asset/font/process/LXGWWenKaiMono-Regular.ttf";

const PROCESS_WOFF2_LXGW_BOLD_PATH = ROOT_PATH + "/source/asset/font/process/LXGWWenKai-Bold.woff2";
const PROCESS_WOFF2_LXGW_REGULAR_PATH = ROOT_PATH + "/source/asset/font/process/LXGWWenKai-Regular.woff2";
const PROCESS_WOFF2_FIRACODR_REGULAR_PATH = ROOT_PATH + "/source/asset/font/process/FiraCode-Regular.woff2";
const PROCESS_WOFF2_LXGWMONO_REGULAR_PATH = ROOT_PATH + "/source/asset/font/process/LXGWWenKaiMono-Regular.woff2";

async function main () {

	let allString = "";
	let codeString = "";
	let headingString = "";

	const promises = [];
	const rootAdress = path.resolve();
	const skeleton = JSON.parse( fs.readFileSync( rootAdress + "/source/asset/catalog/skeleton.json", "utf8" ) );

	for ( const dir of skeleton ) {

		const address = rootAdress + "/post/post/" + dir.name;

		allString += dir.alias;
		promises.push( fc.read( address ) );

	}

	const responses = await Promise.all( promises );

	for ( const res of responses ) for ( const file of res.files ) {

		if ( file.name === ".DS_Store" ) continue;

		const { all, code, heading } = parseMarkdown( file.content ); // Bug: marked会把codespan中的某些符号翻译成转译字符，比如它会把>翻译成&gt;

		allString += all;
		codeString += code;
		headingString += heading;

	}

	allString = fc.deduplication( allString );
	codeString = fc.deduplication( codeString );
	headingString = fc.deduplication( headingString );

	if ( ! fs.existsSync( PROCESS_DIR_PATH ) ) fs.mkdirSync( PROCESS_DIR_PATH );

	await fc.subset( allString, RAW_TTF_LXGW_REGULAR_PATH, PROCESS_TTF_LXGW_REGULAR_PATH );
	await fc.subset( headingString, RAW_TTF_LXGW_BOLD_PATH, PROCESS_TTF_LXGW_BOLD_PATH );
	await fc.subset( codeString, RAW_TTF_FIRACODR_REGULAR_PATH, PROCESS_TTF_FIRACODR_REGULAR_PATH );
	await fc.subset( codeString, RAW_TTF_LXGWMONO_REGULAR_PATH, PROCESS_TTF_LXGWMONO_REGULAR_PATH );

	fs.writeFileSync( PROCESS_WOFF2_LXGW_REGULAR_PATH, ttf2woff2( fs.readFileSync( PROCESS_TTF_LXGW_REGULAR_PATH ) ) );
	fs.writeFileSync( PROCESS_WOFF2_LXGW_BOLD_PATH, ttf2woff2( fs.readFileSync( PROCESS_TTF_LXGW_BOLD_PATH ) ) );
	fs.writeFileSync( PROCESS_WOFF2_FIRACODR_REGULAR_PATH, ttf2woff2( fs.readFileSync( PROCESS_TTF_FIRACODR_REGULAR_PATH ) ) );
	fs.writeFileSync( PROCESS_WOFF2_LXGWMONO_REGULAR_PATH, ttf2woff2( fs.readFileSync( PROCESS_TTF_LXGWMONO_REGULAR_PATH ) ) );

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

		code += text;

		return `<pre><code>${ text }</code></pre>`;

	}

	function parseCodespan ( text ) {

		code += text;

		return `<code>${ text }</code>`;

	}

	function parseHeading ( text, level ) {

		if ( level === 2 && text === "typora-root-url: ...." ) return "";

		heading += text;

		return `<h${ level }>${ text }</h${ level }>`;

	}

}
