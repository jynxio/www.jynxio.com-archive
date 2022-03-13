const htmlGenerator = require( "./library/htmlGenerator" );

const extractCharacters = require( "./library/fontGenerator" );

/* ---------------------------------------------------------------------------------------------------------- */

main();

async function main() {

    const input = "./markdown/test/test.md";
    const output = "./page/test/test.html";

    const html_content = await htmlGenerator( input, output );

    console.log( "🟢 已完成：解析markdown以生成html文件。" );

    const characters = extractCharacters( html_content );

    console.log( "🟢 已完成：提取字符集。" );
    console.log( characters );

}
