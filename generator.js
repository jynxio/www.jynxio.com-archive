const fs = require( "fs" );

const { marked } = require( "marked" );

const { v4: uuidv4 } = require( "uuid" );

const Fontmin = require( "fontmin" );

/* ------------------------------------------------------------------------------------------------------------ */
main( "./source/dev/example.md", "./pages/example.html" );

/**
 * @param {string} input - md文件的路径，比如"./a.md"。
 * @param {string} output - 输出文件的保存路径，比如"./a.html"。
 */
function main( input, output ) {

    let md = "";
    const reader = fs.createReadStream( input );

    reader.setEncoding( "UTF8" );
    reader.on( "data", chunk => md += chunk );
    reader.on( "end", onEnd );

    function onEnd() {

        /* 生成html模板 */
        let catalog_content = "";

        const renderer = {
            hr: _ => "", // 禁用分割线。
            heading: ( content, level ) => {

                if ( content.search( /typora-root-url:/ ) > -1 ) return ""; // 剔除typora的图床地址元素。

                if ( level === 1 ) return `<h1>${ content }</h1>`;

                const id = uuidv4();
                const p = `<p data-level="${ level - 1 }"><a href="#${ id }">${ content }</a></p>`;
                const h = `<h${ level } id="${ id }">${ content }</h${ level }>`;

                catalog_content += p;

                return h;

            },
            checkbox: is_checked => {

                const id = uuidv4();
                const checked_attribute = is_checked ? "checked" : "";
                const checkbox_icon_circle = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
                const checkbox_icon_square = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`;

                return `<input id=${ id } ${ checked_attribute } type="checkbox"><label for=${ id }>${ checkbox_icon_square }</label>`;

            },
            listitem: ( content, is_checkbox, is_checked ) => {

                return ( is_checkbox
                    ? `<li class="check-li">${ content }</li>`
                    : `<li>${ content }</li>`
                );

            },
        };

        marked.use( { renderer, headerIds: false } );

        const article_template = marked.parse( md );
        const html_template = `
            <!DOCTYPE html>
            <html lang="zh-CN">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Sample Document</title>
                    <link rel="stylesheet" href="/style/resize.css">
                    <link rel="stylesheet" href="/style/font.css">
                    <link rel="stylesheet" href="/style/article-page.css">
                </head>
                <body>
                    <section id="sidebar">
                        <nav class="home-button">
                            <p>HOMEPAGE</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="3" viewBox="0 0 24 3" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="23.5 0.5, 0.5 0.5, 2.5 2.5"></polyline></svg>
                        </nav>
                        <nav class="catalog-content">
                            <p>IN THIS ARTICLE</p>
                            ${ catalog_content }
                        </nav>
                    </section>
                    <section id="topbar">
                        <nav class="home-button">
                            <button>HOMEPAGE</button>
                        </nav>
                    </section>
                    <article>${ article_template }</article>
                    <script src="/style/article-page.js"></script>
                </body>
            </html>
        `;

        /* 生成html文件 */
        fs.writeFile( output, html_template, _ => {} );

        /* 按需生成字体文件 */
        const mini_font_path = "./static/font/mini";
        const font_zh_thin_path = "./static/font/NotoSansSC-Thin.ttf";
        const font_zh_bold_path = "./static/font/NotoSansSC-Medium.ttf";
        const font_en_thin_path = "./static/font/IBMPlexSerif-ExtraLight.ttf";
        const font_en_bold_path = "./static/font/IBMPlexSerif-Medium.ttf";
        const font_code_path = "./static/font/FiraCode-Light.ttf";
        const all_character_set = extractText( html_template );
        // const strong_character_set = extractText( html, [ "strong", "b" ] ); // 暂不按需提取加粗字符
        // const code_character_set = extractText( html, [ "code" ] );          // 暂不按需提取代码字符

        optimizeFont( font_zh_thin_path, mini_font_path, all_character_set );
        optimizeFont( font_en_thin_path, mini_font_path, all_character_set );
        optimizeFont( font_zh_bold_path, mini_font_path, all_character_set );
        optimizeFont( font_en_bold_path, mini_font_path, all_character_set );
        optimizeFont( font_code_path, mini_font_path, all_character_set );

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
