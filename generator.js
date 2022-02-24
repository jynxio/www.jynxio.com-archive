const fs = require( "fs" );

const { marked } = require( "marked" );

generate(
    "./source/字符编码的含义与历史.md",
    "./pages/字符编码的含义与历史.html"
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

        const header = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="stylesheet" href="../style/resize.css">
            </head>
            <body>
                <article>
        `;
        const footer = `
                </article>
            </body>
            </html>
        `;
        const body = marked.parse( markdown_string );

        const html = header + body + footer;

        fs.writeFile( output_file, html, _ => console.log( "大功告成！" ) );

    } );
}
