const fs = require( "fs" );

const { marked } = require( "marked" );

generate(
    "./source/dev/example.md",
    "./pages/example.html"
);

/**
 * 将md文件转译为html文件。
 * @param {string} input_file - md文件的路径字符串，比如"./a.md"
 * @param {string} output_file - 输出文件的路径字符串，比如"./a.html"
 */
function generate( input_file, output_file ) {

    let markdown_string = "";

    const reader_stream = fs.createReadStream( input_file );

    reader_stream.setEncoding( "UTF8" );
    reader_stream.on( "data", chunk => markdown_string += chunk );
    reader_stream.on( "end", _ => {

        /* 生成html字符串 */
        let html_body_string;

        html_body_string = marked.parse( markdown_string );

        /* 剔除<h2 id="typora-root-url-*">标签 */
        const its_index = html_body_string.indexOf( `<h2 id="typora-root-url-`, 0 );

        if ( its_index !== -1 ) {

            const slice_from_here = html_body_string.indexOf( `</h2>`, its_index ) + 6;

            html_body_string = html_body_string.slice( slice_from_here );

        }

        /* 合并 */
        const html_header_string = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="stylesheet" href="/style/font.css">
                <link rel="stylesheet" href="/style/resize.css">
                <link rel="stylesheet" href="/style/page.css">
            </head>
            <body>
                <article>
        `;
        const html_footer_string = `
                </article>
            </body>
            </html>
        `;
        const html_string = html_header_string + html_body_string + html_footer_string;

        /* 生成html文件 */
        fs.writeFile( output_file, html_string, _ => console.log( "大功告成！" ) );

    } );
}
