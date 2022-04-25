const configuration = require( "../article/config" );
const beautify = require( "js-beautify" ).html;

let html_content;

html_content = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jynxio's notes</title>
    </head>
    <body>
        <header>
            <button>HOMEPAGE</button>
        </header>
        <main>${ createSections( configuration ) }</main>
    </body>
    </html>
`;
html_content = beautify( html_content );

function createSections( data ) {

    const sections = data.map( folder => {

        const alias = folder.alias;
        const h2 = `<h2>${ alias }</h2>`;
        const lis = folder.children.map( file => {

            const href = `href="${ file.buildPath.slice( 1 ) }"`;
            const text_content = file.alias;
            const a = `<a ${ href }>${ text_content }</a>`;
            const li = `<li>${ a }</li>`;

            return li;

        } ).join( "" );
        const ol = `<ol>${ lis }</ol>`
        const section = `<section>${ h2 }${ ol }</section>`;

        return section;

    } );

    return sections.join( "" );

}

console.log( html_content ); // TODO GOGOGO! It work!

// TODO 自动生成catalogue
// TODO 将“生成article”、“生成字体”、“字体转woff2”、“生成catalogue”等合并为一条工作流水线
// TODO 简化流水线上面的每一步，不然维护很困难