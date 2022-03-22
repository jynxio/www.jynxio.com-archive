const fontcaster = require( "fontcaster" );

async function castFont() {

    const read_response = await fontcaster.read( "./page" );

    if ( ! read_response.success ) {

        console.error( "READ ERROR: " + read_response.error );

        return;

    }

    for ( const file of read_response.files ) {

        const { name, path, content } = file;

        if ( name === ".DS_Store" ) continue;

        const html_content = fontcaster.parseHtml( content );

        // console.log( html_content );

    }

}

module.exports = castFont;
