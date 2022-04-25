const readlineSync = require( "readline-sync" );
const { createHtml } = require( "./createHtml" );
const { write } = require( "./write" );
const configuration = require( "./config" );

/**
 * （异步）生成catalogue.html。
 * @returns { Promise } - Promise代表undefined。
 */
async function create() {

    while ( true ) {

        const confirm = readlineSync.question( `Are you sure?\nPlease enter "y" or "n": ` );

        if ( confirm === "y" ) break;
        if ( confirm === "n" ) return;

    }

    const html = createHtml( configuration.data );
    const response = await write( html, configuration.path );

    if ( ! response.success ) {

        console.log( "Error: ", response.error );

        return;

    }

    console.log( "Done!" );

}

module.exports = { create };
