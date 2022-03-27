const createFontFile = require( "./font/index" );

const createHtmlFile = require( "./html/index" );

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
