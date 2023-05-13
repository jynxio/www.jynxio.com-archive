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

const ADDITIONAL_CHARACTERS_LXFW_BOLD = "";
const ADDITIONAL_CHARACTERS_LXFW_REGULAR = "搜索";
const ADDITIONAL_CHARACTERS_FIRACODE_REGULAR = "><&\"'";
const ADDITIONAL_CHARACTERS_LXGWMONO_REGULAR = "";

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

		/**
		 * BUG:
		 *   marked.js会将行内代码和代码块中的某些字符转换为转义字符，比如「>」会被转译成「&gt;」，我通过使用「ADDITIONAL_CHARACTERS_FIRACODE_REGULAR」来缓解/修复这个问题。
		 *   - relevant issue: https://github.com/markedjs/marked/issues/2727
		 *   - playgroud: https://marked.js.org/demo/?text=%0A&options=%7B%0A%20%22async%22%3A%20false%2C%0A%20%22baseUrl%22%3A%20null%2C%0A%20%22breaks%22%3A%20false%2C%0A%20%22extensions%22%3A%20null%2C%0A%20%22gfm%22%3A%20true%2C%0A%20%22headerIds%22%3A%20true%2C%0A%20%22headerPrefix%22%3A%20%22%22%2C%0A%20%22highlight%22%3A%20null%2C%0A%20%22langPrefix%22%3A%20%22language-%22%2C%0A%20%22mangle%22%3A%20true%2C%0A%20%22pedantic%22%3A%20false%2C%0A%20%22sanitize%22%3A%20false%2C%0A%20%22sanitizer%22%3A%20null%2C%0A%20%22silent%22%3A%20false%2C%0A%20%22smartypants%22%3A%20false%2C%0A%20%22tokenizer%22%3A%20null%2C%0A%20%22walkTokens%22%3A%20null%2C%0A%20%22xhtml%22%3A%20false%0A%7D&version=master
		 *   - HTML实体编码表: https://www.w3school.com.cn/charsets/ref_html_8859.asp
		 */
		const { all, code, heading } = parseMarkdown( file.content );

		allString += all;
		codeString += code;
		headingString += heading;

	}

	allString += ADDITIONAL_CHARACTERS_LXFW_BOLD + ADDITIONAL_CHARACTERS_LXFW_REGULAR + ADDITIONAL_CHARACTERS_FIRACODE_REGULAR + ADDITIONAL_CHARACTERS_LXGWMONO_REGULAR;
	codeString += ADDITIONAL_CHARACTERS_FIRACODE_REGULAR + ADDITIONAL_CHARACTERS_LXGWMONO_REGULAR;
	headingString += ADDITIONAL_CHARACTERS_LXFW_BOLD;

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
		xhtml: false,
		mangle: false,
		headerIds: false,
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
