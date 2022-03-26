const createFontFile = require( "./font/index" );

const createHtmlFile = require( "./html/index" );

const CHARACTER_SET_PATH = "./static/font/character-set.txt";

const ORIGIN_FONT_PATH_EN_400 = "./static/font/origin-ibmplexsans-400.woff";
const ORIGIN_FONT_PATH_EN_700 = "./static/font/origin-ibmplexsans-700.woff";
const ORIGIN_FONT_PATH_ZH_400 = "./static/font/origin-notosans-400.woff";
const ORIGIN_FONT_PATH_ZH_700 = "./static/font/origin-notosans-700.woff";
const ORIGIN_FONT_PATH_CO_400 = "./static/font/origin-firacode-400.woff";

const SUBSET_FONT_PATH_EN_400 = "./static/font/subset-ibmplexsans-400.woff";
const SUBSET_FONT_PATH_EN_700 = "./static/font/subset-ibmplexsans-700.woff";
const SUBSET_FONT_PATH_ZH_400 = "./static/font/subset-notosans-400.woff";
const SUBSET_FONT_PATH_ZH_700 = "./static/font/subset-notosans-700.woff";
const SUBSET_FONT_PATH_CO_400 = "./static/font/subset-firacode-400.woff";

const UNICODES_PATH_EN_400 = "./static/font/unicodes-en-400.txt";
const UNICODES_PATH_EN_700 = "./static/font/unicodes-en-700.txt";
const UNICODES_PATH_ZH_400 = "./static/font/unicodes-zh-400.txt";
const UNICODES_PATH_ZH_700 = "./static/font/unicodes-zh-700.txt";
const UNICODES_PATH_CO_400 = "./static/font/unicodes-co-400.txt";

/**
 *
 * @param { string } input_path - md文件的路径，比如"./test.md"。
 * @param { string } output_path - html文件的路径，比如"./test.html"。
 * @returns { Promise } - Promise代表是否执行成功，若成功则返回{success: true}对象，否则返回{success: false, error}对象。
 */
async function main( input_path, output_path ) {

    /* 根据md文件来创建html文件。 */
    const html_response = await createHtmlFile( input_path, output_path );

    if ( ! html_response.success ) {

        console.error( "Create html file error: ", html_response.error );

        return { success: false, error: html_response.error };

    }

    const html_content = html_response.content;

}
