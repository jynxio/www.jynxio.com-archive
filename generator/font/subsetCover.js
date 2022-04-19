const fontcaster = require( "font-caster" );
const readlineSync = require( "readline-sync" );

/* 原始字体文件的路径 */
const ORIGIN_JYNXIO_700 = "./static/font/original/cover-700.ttf";
/* 子集字体文件的路径 */
const SUBSET_JYNXIO_700 = "./static/font/subset/cover-700.ttf";
/* 子集化的字符 */
const SUBSET_CONTENT = [
    "JYNXIO",
    "SCROL",
    "LDOWN",
    " ",
];

subset();

/**
 * （异步）询问是否基于"JYNXIO"来子集化jynxio-700.ttf文件。
 * @returns { Promise } - Promise代表undefined。
 */
async function subset() {

    console.log( `\nThe program will subset the jynxio-700.ttf based on "${ SUBSET_CONTENT.join( "" ) }".` );

    while ( true ) {

        const confirm = readlineSync.question( `Are you sure?\nPlease enter "y" or "n": ` );

        if ( confirm === "y" ) break;
        if ( confirm === "n" ) return;

    }

    const response = await fontcaster.subset( SUBSET_CONTENT.join( "" ), ORIGIN_JYNXIO_700, SUBSET_JYNXIO_700 );

    if ( ! response.success ) {

        console.error( "Error: ", response.error );

        return;

    }

    console.log( "Done!" );

}
