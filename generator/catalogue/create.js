const config = require( "../article/config" );
const html_content = `
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
        <main>${ createSections( config ) }</main>
    </body>
    </html>
`;

function createSections( data ) {

    const sections = data.map( scope => {

        const h2 = `<h2>${ scope.name }</h2>`;
        // TODO 整个config传递下来，会使得维护很难懂...
    } );

    console.log( data );

}

// TODO 自动生成catalogue
// TODO 将“生成article”、“生成字体”、“字体转woff2”、“生成catalogue”等合并为一条工作流水线
// TODO 简化流水线上面的每一步，不然维护很困难