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

    /* Subset font file. */
    const origin_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular.woff";
    const subset_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular-subset.woff";

    const subset_response = await fontcaster.subset( characters, origin_font_path, subset_font_path );

    if ( ! subset_response.success ) {

        console.error( "SUBSET ERROR: " + subset_response.error );

        return;

    }

    // const subset_information = subset_response.information;

    // console.log( subset_information.successfulCharacters  );
    // console.log( subset_information.successfulUnicodes  );
    // console.log( subset_information.failedCharacters  );
    // console.log( subset_information.failedUnicodes  );

    /* Output characters. */
    // TODO

}

module.exports = castFont;
