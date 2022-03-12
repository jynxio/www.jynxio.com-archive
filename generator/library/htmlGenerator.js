const fs = require( "fs" );
const { marked } = require( "marked" );
const { v4: uuidv4 } = require( "uuid" );

/**
 * 将一个markdown文件转译为html文件。
 * @param {string} input_path - markdown文件的路径，比如"../../markdown/javascript/a.md"。
 * @param {string} output_path - html文件的路径，比如"../../page/javascript/a.html"。
 */
export default function( input_path, output_path ) {

    const i = input_path;
    const o = output_path;

    let markdown_content = "";

    const reader = fs.createReadStream( i );

    reader.setEncoding( "UTF8" );
    reader.on( "data", chunk => markdown_content += chunk );
    reader.on( "end", onEnd );

    // 能不能把onEnd移动到函数以外？？？
    function onEnd() {

        let catalog_content = "";

        marked.use( {

            headerIds: false,

            renderer: {

                hr: parseHr,

                heading: parseH123456,

                checkbox: parseCheckboxInput,

                listitem: parseLi,

            },

        } );

    }

    function parseHr() {

        return "";

    }

    function parseH123456( content, level ) {

        /* 若Typora设置了图床地址，则会注入下述内容的h2，该语句旨在于剔除该h2。 */
        if ( content.search( /typora-root-url:/ ) > -1 ) return "";

        /* 处理h1。 */
        if ( level === 1 ) {

            const h = `<h1>${ content }</h1>`;

            const p = `<p id="last-updated">Last Updated: ${ getDate() }</p>`;

            return ( h + p );

        }

        /* 处理h23456。 */
        const id = uuidv4();

        const p = `<p data-level="${ level - 1 }"><a href="#${ id }">${ content }</a></p>`;

        const h = `<h${ level } id="${ id }">${ content }</h${ level }>`;

        catalog_content += p;

        return h;

    }

    function parseCheckboxInput( is_checked ) {

        const id = uuidv4();

        const checked_property = is_checked ? "checked" : "";

        const icon_circle = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        const icon_square = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`;

        return `<input id=${ id } ${ checked_property } type="checkbox"><label for=${ id }>${ icon_square }</label>`;

    }

    function parseLi( content, is_checkbox, is_checked ) {

        const li = is_checkbox ? `<li class="check-li">${ content }</li>` : `<li>${ content }</li>`;

        return li;

    }

}
