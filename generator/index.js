const htmlGenerator = require( "./library/htmlGenerator" );

/* ---------------------------------------------------------------------------------------------------------- */

main();

async function main() {

    const input = "./markdown/test/test.md";
    const output = "./page/test/test.html";

    const html_content = await htmlGenerator( input, output );

    console.log( "👌" );
    console.log( html_content );

}
