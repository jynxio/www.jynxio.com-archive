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
                <header></header>
                <main>
                    <nav></nav>
                    <article>
        `;
        const footer = `
                    </article>
                    <nav></nav>
                </main>
                <footer></footer>
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
        const strong_character_set = extractText( html, [ "strong", "b" ] );
        const code_character_set = extractText( html, [ "code" ] );

        optimizeFont( font_zh_thin_path, mini_font_path, all_character_set );
        optimizeFont( font_en_thin_path, mini_font_path, all_character_set );
        optimizeFont( font_zh_bold_path, mini_font_path, strong_character_set );
        optimizeFont( font_en_bold_path, mini_font_path, strong_character_set );
        optimizeFont( font_core_path, mini_font_path, code_character_set );

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
 * 从html文件中提取出所有或指定标签的内容，然后合并成一段新的字符串，最后返回这段新的字符串。
 * @param {string} input - html文件的内容，是一串字符串。注意，html文件的标签名称不区分大小写。
 * @param {Array} [node_names] - 一个数组，它包含了零至多个标签的名称，比如["h1", "p"]。缺省时，返回结果将包含所有标签的内容，
 *                               否则返回结果将只包含指定标签的内容。注意，1.不能输入自闭合标签；2.标签名称不区分大小写。
 * @returns {string} - 一个字符串，它包含了html文件中的所有标签的内容。
 */
 function extractText( input, nodes ) {

    if ( !Array.isArray( nodes ) ) return core( input );

    if ( !nodes.length ) return "";

    const regexp = new RegExp( `</?(${ nodes.join( "|" ) })(>|(\\s*>)|(\\s[^>]*>))`, "ig" );
    const tags = input.match( regexp );

    if ( !tags ) return "";

    let output = "";
    let from_index_in_tags = 0;
    let from_index_in_input = 0;

    while ( from_index_in_tags < tags.length ) {

        const header = tags[ from_index_in_tags ];
        const footer = header.match( /<[a-z][a-z0-9]*/i )[ 0 ].replace( "<", "</" ) + ">";

        const header_index = from_index_in_tags;
        const footer_index = tags.indexOf( footer, from_index_in_tags );

        const from = input.indexOf( header, from_index_in_input );
        const to = input.indexOf( footer, from_index_in_input ) + footer.length;

        output += core( input.slice( from ,to ) );
        from_index_in_tags = footer_index + 1;
        from_index_in_input = to;

    }

    return output;

    function core( input ) {

        const tags = input.match( /<!?\/?[a-z][a-z0-9]*[^>]*>/ig );

        if ( !tags ) return "";

        let output = "";
        let from_index = 0;

        tags.forEach( tag => {

            const from = input.indexOf( tag, from_index );
            const snippet = input.slice( from_index, from );

            output += snippet;
            from_index = from + tag.length;

        } );

        return output;

    }

}
