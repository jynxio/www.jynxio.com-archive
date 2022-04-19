const fontcaster = require( "font-caster" );
const readlineSync = require( "readline-sync" );

/* 原始字体文件的路径 */
const ORIGIN_FONT_100 = "./static/font/original/cover-100.ttf";
const ORIGIN_FONT_700 = "./static/font/original/cover-700.ttf";
/* 子集字体文件的路径 */
const SUBSET_FONT_100 = "./static/font/subset/cover-100.ttf";
const SUBSET_FONT_700 = "./static/font/subset/cover-700.ttf";
/* 子集化的字符 */
const SUBSET_CHARACTERS = [
    "JYNXIO",
    "SCROL",
    "LDOWN",
    " ",
];

subset();

/**
 * （异步）询问是否进行字体子集化。
 * @returns { Promise } - Promise代表undefined。
 */
async function subset() {

    console.log( `\nThe program will subset the cover-100.ttf and cover-700.ttf based on "${ SUBSET_CHARACTERS.join( "" ) }".` );

    while ( true ) {

        const confirm = readlineSync.question( `Are you sure?\nPlease enter "y" or "n": ` );

        if ( confirm === "y" ) break;
        if ( confirm === "n" ) return;

    }

    const response_1 = await fontcaster.subset( SUBSET_CHARACTERS.join( "" ), ORIGIN_FONT_700, SUBSET_FONT_700 );
    const response_2 = await fontcaster.subset( SUBSET_CHARACTERS.join( "" ), ORIGIN_FONT_100, SUBSET_FONT_100 );

    if ( ! response_1.success ) {

        console.error( "Error: ", response_1.error );

        return;

    }

    if ( ! response_2.success ) {

        console.error( "Error: ", response_2.error );

        return;

    }

    console.log( "Done!" );

}
