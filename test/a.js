const { marked } = require( "marked" );

const fs = require( "fs" );

const reader_stream = fs.createReadStream( "./npm.md" );

let markdown_string = "";

reader_stream.setEncoding( "UTF8" );
reader_stream.on( "data", chunk => markdown_string += chunk );
reader_stream.on( "end", _ => {

    const body = marked.parse( markdown_string );
    const header = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
    `;
    const footer = `
        </body>
        </html>
    `;

    const html = header + body + footer;

    fs.writeFile( "./b.html", html, _ => console.log( "完成" ) );

} );
