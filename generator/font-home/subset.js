const fontcaster = require( "font-caster" );
const readlineSync = require( "readline-sync" );
const config = require( "./config" );

/**
 * （异步）询问是否进行字体子集化。
 * @returns { Promise } - Promise代表undefined。
 */
async function subset() {

    console.log( `\nThe program will subset the three-100.ttf and three-700.ttf based on "${ config.characters.join( "" ) }".` );

    while ( true ) {

        const confirm = readlineSync.question( `Are you sure?\nPlease enter "y" or "n": ` );

        if ( confirm === "y" ) break;
        if ( confirm === "n" ) return;

    }

    const response_1 = await fontcaster.subset( config.characters.join( "" ), config.origin.en700, config.subset.en700 );
    const response_2 = await fontcaster.subset( config.characters.join( "" ), config.origin.en400, config.subset.en400 );
    const response_3 = await fontcaster.subset( config.characters.join( "" ), config.origin.en100, config.subset.en100 );

    if ( ! response_1.success ) {

        console.error( "Error: ", response_1.error );

        return;

    }

    if ( ! response_2.success ) {

        console.error( "Error: ", response_2.error );

        return;

    }

    if ( ! response_3.success ) {

        console.error( "Error: ", response_2.error );

        return;

    }

    console.log( "Done!" );

}

module.exports = { subset };
