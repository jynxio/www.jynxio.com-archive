const createFontFile = require( "./font/index" );

const createHtmlFile = require( "./html/index" );

const CHARACTER_SET_PATH = "./static/font/character-set.txt";

const ORIGIN_FONT_SC_REGULAR_PATH = "./static/font/noto-sans-sc-v24-chinese-simplified-regular.woff";
const SUBSET_FONT_SC_REGULAR_PATH = "./static/font/noto-sans-sc-v24-chinese-simplified-regular-subset.woff";

const ORIGIN_FONT_SC_BOLD_PATH = "";
const SUBSET_FONT_SC_BOLD_PATH = "";

const ORIGIN_FONT_EN_REGULAR_PATH = "";
const SUBSET_FONT_EN_REGULAR_PATH = "";

const ORIGIN_FONT_EN_BOLD_PATH = "";
const SUBSET_FONT_EN_BOLD_PATH = "";

const ORIGIN_FONT_CODE_REGULAR_PATH = "";
const SUBSET_FONT_CODE_REGULAR_PATH = "";

// TODO 继续创建完这个自动增量生成html和字体文件的流水线。

main();

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


async function f2() {

    const html_files_path = "./page";
    const txt_file_path = "./static/font/character-set.txt";
    const origin_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular.woff";
    const subset_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular-subset.woff"

    createFontFile( html_files_path, txt_file_path, origin_font_path, subset_font_path ).then( response => {

        if ( ! response.success ) {

            console.error( response.error );

            return { success: false, error: response.error };

        }

        return { success: true };

    } );

}
