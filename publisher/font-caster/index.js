const fontcaster = require( "font-caster" );

async function castFont() {

    /* Read all html files. */
    const read_response = await fontcaster.read( "./page" );

    if ( ! read_response.success ) {

        console.error( "READ ERROR: " + read_response.error );

        return;

    }

    /* Extract characters. */
    let characters = "";

    for ( const file of read_response.files ) {

        const { name, type, content } = file;

        if ( name === ".DS_Store" ) continue;

        if ( type !== "html" ) continue;

        characters += fontcaster.deduplication( fontcaster.parseHtml( content ) );

    }

    characters = fontcaster.deduplication( characters );

    /* Subset font file. */
    const origin_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular.woff";
    const subset_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular-subset.woff";

    const subset_response = await fontcaster.subset( characters, origin_font_path, subset_font_path );

    if ( ! subset_response.success ) {

        console.error( "SUBSET ERROR: " + subset_response.error );

        return;

    }

    printSubsetInformation( subset_response.information );

    /* Output characters. */
    const write_response = await fontcaster.write( fontcaster.convert( characters ), "./static/font/character-set.txt" );

    if ( ! write_response.success ) {

        console.error( "WRITE ERROR: " + write_response.error );

        return;

    }

}

function printSubsetInformation( info ) {

    const success_unicodes = info.successfulUnicodes;
    const success_characters = info.successfulCharacters;

    const failed_unicodes = info.failedUnicodes;
    const failed_characters = info.failedCharacters;

    const number_success = success_unicodes.length;
    const number_failed = failed_unicodes.length;
    const number_total = number_success + number_failed;

    console.warn( "------------------------ SUBSET INFORMATION ------------------------" );
    console.warn( "Total            : " + number_total );
    console.warn( "Number of success: " + number_success );
    console.warn( "Number of failed : " + number_failed );
    console.warn( "------------------------ SUBSET INFORMATION ------------------------" );

}

module.exports = castFont;
