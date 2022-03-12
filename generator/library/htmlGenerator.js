const fs = require( "fs" );

/**
 * 将一个markdown文件转译为html文件。
 * @param {string} input_path - markdown文件的路径，比如"../../markdown/javascript/a.md"。
 * @param {string} output_path - html文件的路径，比如"../../page/javascript/a.html"。
 */
export default function ( input_path, output_path ) {

    const i = input_path;
    const o = output_path;

    let markdown_content = "";

    const reader = fs.createReadStream( i );

}