const fontcaster = require( "font-caster" );
const castFont = require( "./font-caster/index" );

const html_files_path = "./page";
const origin_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular.woff";
const subset_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular-subset.woff"

// castFont( html_files_path, origin_font_path, subset_font_path ).then( response => {

//     if ( ! response.success ) return;

//     console.log( "SUCCESS!" );

// } );

fontcaster.read( "./static/font/character-set.txt", true ).then( response => {

    if ( ! response.success ) {

        console.error( "Error: ", response.error );

        return;

    }

    for ( const file of response.files ) {

        console.log( file.name, file.content );

    }

} );
