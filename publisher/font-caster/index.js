const fontcaster = require( "font-caster" );

/**
 * 字体子集化。
 * @param { string } html_files_path - 一个html文本的路径，或存储零至多个html文本的目录的路径，比如"./page/example.html"或"./page"。
 * @param { string } txt_file_path - txt文本的路径，比如"./static/font/character-set.txt"。txt文本的内容是以逗号分隔的unicode（基
 * 于十进制）。该方法将使用txt字符集与html字符集的并集（自动进行字符去重）来进行字体子集化，最后并集将以逗号分隔的unicode的形式覆写回txt文本中。
 * 如果你是第一次进行字体子集化，请提供空的txt文本。如果你是第二次进行字体子集化，请提供上一次子集化所产生的txt文本，这样本次子集化所产生的字体文件
 * 将包含两次子集化的字符集。
 * @param { string } origin_font_path - 原始的字体文件的路径，比如 "./origin.otf"，也支持 ttf、woff。该方法不会改变原始的字体文件。
 * @param { string } subset_font_path - 生成的字体文件的路径，比如 "./sunset.otf"，生成的字体文件的格式必须与生原始的字体文件的格式一致。
 * 若存在同名文件，则该方法会覆盖同名文件。
 * @returns { Promise } - Promise代表是否子集化成功，若成功则返回{success: true}对象，否则返回{success: false, error}对象。
 */
async function castFont( html_files_path, txt_file_path,  origin_font_path, subset_font_path ) {

    /* Read all html files and txt file. */
    const read_html_response = await fontcaster.read( html_files_path, false );

    if ( ! read_html_response.success ) {

        console.error( "Read Error: ", read_html_response.error );

        return { success: false, error: read_html_response.error };

    }

    const read_txt_response = await fontcaster.read( txt_file_path, true );

    if ( ! read_txt_response.success ) {

        console.error( "Read Error: ", read_txt_response.error );

        return { success: false, error: read_txt_response.error };

    }

    /* Create character set. */
    let characters = fontcaster.convert( read_txt_response.files[ 0 ].content );

    for ( const file of read_html_response.files ) {

        const { name, type, content } = file;

        if ( name === ".DS_Store" ) continue;

        if ( type !== "html" ) continue;

        characters += fontcaster.deduplication( fontcaster.parseHtml( content ) );

    }

    characters = fontcaster.deduplication( characters );

    /* Subset font file. */
    const subset_response = await fontcaster.subset( characters, origin_font_path, subset_font_path );

    if ( ! subset_response.success ) {

        console.error( "Subset error: ", subset_response.error );

        return { success: false, error: subset_response.error };

    }

    /* Print information about subset. */
    const print_subset_information_options = {

        printTotalNumber: true,

        printSuccessfulNumber: true,

        printFailedNumber: true,

        printSuccessfulUnicodes: false,

        printSuccessfulCharacters: false,

        printFailedUnicodes: false,

        printFailedCharacters: false,

    };

    printInformationAboutSubset( subset_response.information, print_subset_information_options );

    /* Write character set to txt file. */
    const unicodes = fontcaster.convert( characters );

    fontcaster.write( unicodes, txt_file_path );

    /* The end. */
    return { success: true };

    function printInformationAboutSubset( information, {

        printTotalNumber = true,

        printSuccessfulNumber = true,

        printFailedNumber = true,

        printSuccessfulUnicodes = false,

        printSuccessfulCharacters = false,

        printFailedUnicodes = false,

        printFailedCharacters = false,

    } = {} ) {

        const successful_unicodes = information.successfulUnicodes;
        const successful_characters = information.successfulCharacters

        const failed_unicodes = information.failedUnicodes;
        const failed_characters = information.failedCharacters;

        const successful_number = successful_unicodes.length;
        const failed_number = failed_unicodes.length;

        const total_number = successful_number + failed_number;

        console.log( "--------------------------- Subset Information ---------------------------"  );
        printTotalNumber          && console.log( "Total number:          ", total_number          );
        printSuccessfulNumber     && console.log( "Successful number:     ", successful_number     );
        printFailedNumber         && console.log( "Failed number:         ", failed_number         );
        printSuccessfulUnicodes   && console.log( "Successful unicodes:   ", successful_unicodes   );
        printSuccessfulCharacters && console.log( "Successful characters: ", successful_characters );
        printFailedUnicodes       && console.log( "Failed unicodes:       ", failed_unicodes       );
        printFailedCharacters     && console.log( "Failed characters:     ", failed_characters     );
        console.log( "--------------------------- Subset Information ---------------------------"  );

    }

}

module.exports = castFont;
