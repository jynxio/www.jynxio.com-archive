const fs = require( "fs" );

const { marked } = require( "marked" );

const Fontmin = require( "fontmin" );

/* ---------------------------------------------------------------------------- */
translateMdToHtml( "./source/dev/example.md", "./pages/example.html" );

/**
 * 将md文件转译为html文件。
 * @param {string} input - md文件的路径，比如"./a.md"。
 * @param {string} output - 输出文件的保存路径，比如"./a.html"。
 */
function translateMdToHtml( input, output ) {

    /* 读取md文件 */
    let md = "";
    const reader = fs.createReadStream( input );

    reader.setEncoding( "UTF8" );
    reader.on( "data", chunk => md += chunk );
    reader.on( "end", onEnd );

    function onEnd() {

        let body = marked.parse( md );

        /* 剔除<h2 id="typora-root-url-*">标签，这是typora的生成图像路径功能产生的副作用 */
        const extra_token = `<h2 id="typora-root-url-`;
        const is_exit = body.includes( extra_token );

        if ( is_exit ) {

            const index = body.indexOf( extra_token );
            const begin = body.indexOf( "</h2>", index ) + 6;

            body = body.slice( begin );

        }

        /* 生成html字符串 */
        const header = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title></title>
                <link rel="stylesheet" href="/style/font.css">
                <link rel="stylesheet" href="/style/resize.css">
                <link rel="stylesheet" href="/style/page.css">
            </head>
            <body>
                <article>
        `;
        const footer = `
                </article>
            </body>
            </html>
        `;
        const html = header + body + footer;

        /* 生成html文件 */
        fs.writeFile( output, html, _ => {} );

        /* 精简字体文件 */
        const mini_font_path = "./static/font/mini";
        const font_zh_thin_path = "./static/font/NotoSansSC-Thin.ttf";
        const font_zh_bold_path = "./static/font/NotoSansSC-Medium.ttf";
        const font_en_thin_path = "./static/font/IBMPlexSerif-ExtraLight.ttf";
        const font_en_bold_path = "./static/font/IBMPlexSerif-Medium.ttf";
        const font_core_path = "./static/font/FiraCode-Regular.ttf";
        const all_character_set = extractText( html );

        optimizeFont( font_zh_thin_path, mini_font_path, all_character_set );
        optimizeFont( font_zh_bold_path, mini_font_path, all_character_set );
        optimizeFont( font_en_thin_path, mini_font_path, all_character_set );
        optimizeFont( font_en_bold_path, mini_font_path, all_character_set );
        optimizeFont( font_core_path, mini_font_path, all_character_set );

    }

}

/**
 * 缩减字体文件所包含的字符集，使其只包含characters的字符集，该放放会创建新的字体文件（woff2），
 * 该方法不会修改原字体文件。
 * @param {string} input - 待优化的字体文件的路径（ttf格式）。
 * @param {string} output - 结果文件夹的路径，生成的字体文件将会存储在该文件夹中。
 * @param {string} characters - 字符子集。
 */
function optimizeFont( input, output, characters ) {

    const fontmin = new Fontmin()
        .src( input )
        .use( Fontmin.glyph( { text: characters } ) )
        .use( Fontmin.ttf2woff2() )
        .dest( output );

    fontmin.run( ( error, files, stream ) => {

        if ( error ) {

            throw error;

        }

    } );

}

/**
 * 从html文件中提取出所有标签的内容，然后合并成一个字符串，最后返回这个字符串。
 * @param {string} input - html文件的内容，是一串字符串。
 * @returns {string} - 一个字符串，它包含了html文件中的所有标签的内容。
 */
function extractText( input ) {

    let output = "";
    let starting_index = 0;

    input.match( /<!?\/?[a-z][a-z0-9]*[^>]*>/ig ).forEach( token => {

        const endding_index = input.indexOf( token, starting_index );
        const next_starting_index = endding_index + token.length;
        const snippet = input.slice( starting_index, endding_index );

        output += snippet;
        starting_index = next_starting_index;

    } );

    return output;

}
