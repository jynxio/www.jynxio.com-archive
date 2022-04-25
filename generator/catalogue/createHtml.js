const beautify = require( "js-beautify" ).html;

/**
 * 生成html模版。
 * @param { Object } data - article/config.js的输出值。
 * @returns { string } - html模版。
 */
function createHtml( data ) {

    return beautify(`
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
                <button><a href="/index.html"><strong>HOMEPAGE</strong></a></button>
            </header>
            <main>${ createSections( data ) }</main>
        </body>
        </html>
    `);

    function createSections( data ) {

        return data.map( folder => {

            const h2 = `<h2>${ folder.alias }</h2>`;
            const lis = createLis( folder.children );
            const ol = `<ol>${ lis }</ol>`;
            const section = `<section>${ h2 }${ ol }</section>`;

            return section;

        } ).join( "" );

    }

    function createLis( data ) {

        return data.map( file => {

            const a = `<a href="${ file.buildPath.slice( 1 ) }">${ file.alias }</a>`;
            const li = `<li>${ a }</li>`;

            return li;

        } ).join( "" );

    }

}

module.exports = { createHtml };
