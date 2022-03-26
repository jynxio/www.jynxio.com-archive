const fontcaster = require( "font-caster" );

// TODO 重写了字体子集化的函数！下一步是什么呢？

/**
 * 字体子集化。
 * @param { string } html_path - html文件的路径（如"./page/index.html"），或文件夹的路径（如"./page"）。若
 * 入参是html文件的路径，则将基于该html文件来进行字体子集化；若入参是文件夹的路径，则将基于该文件夹内的所有的html文件
 * 来进行字体子集化。
 * @param { undefined | string } unicode_path - txt文件的路径（如"./unicode.txt"），txt的内容必须是以逗号
 * 分隔的unicode，参考write API；若入参是txt文件的路径，则其中的unicode将一起参与字体子集化，若入参是undefined，
 * 则不影响字体子集化。
 * @param { string } origin_font_path - 原始的字体文件的路径（如"./origin.woff"），支持otf、ttf、woff格式。
 * @param { string } subset_font_path - 生成的字体文件的路径（如"./subset.woff"），生成的字体文件的格式必须等
 * 于原始的字体文件的格式。
 * @param { undefined | Array<string> } tagnames - 若入参是undefined，则会提取所有的html文件的所有的标签的
 * 内容来进行字体子集化；若入参是["p", "a"]，则会提取所有的html文件的所有的h1标签和a标签的内容来进行字体子集化，同理
 * 类推其他标签。注意：1.不能输入自闭合标签；2.不区分标签名的大小写。
 * @returns { Promise } - Promise代表是否执行成功，若失败，则返回{success: false, error}对象，若成功，则返回
 * {success, true, information}对象，参考subset API。
 */
async function subsetFont(

    html_path,

    unicode_path,

    origin_font_path,

    subset_font_path,

    tagnames,

) {

    let characters  = "";

    /* 提取txt文件的字符集。 */
    if ( unicode_path !== undefined ) {

        const response = await fontcaster.read( unicode_path, true );

        if ( ! response.success ) return { success: false, error: response.error };

        characters += fontcaster.convert( response.files[ 0 ].content );

    }

    /* 提取html文件的字符集。 */
    {

        const response = await fontcaster.read( html_path, false );

        if ( ! response.success ) return { success: false, error: response.error };

        for ( const file of response.files ) {

            const { name, type, content } = file;

            if ( type !== "html" ) continue;

            characters += fontcaster.deduplication( fontcaster.parseHtml( content, tagnames ) );

        }

        characters = fontcaster.deduplication( characters );

    }

    /* 存储字符。 */
    {

        const unicodes = fontcaster.convert( characters );

        const response = fontcaster.write( unicodes, unicode_path );

        if ( ! response.success ) return { success: false, error: response.error };

    }

    /* 执行字体子集化。 */
    {

        const response = await fontcaster.subset( characters, origin_font_path, subset_font_path );

        if ( ! response.success ) return { success: false, error: response.error };

        return { success: true, information: response.information };

    }

}
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
async function createFontFile( html_files_path, txt_file_path,  origin_font_path, subset_font_path ) {

    /* Read all html files and txt file. */
    const read_html_response = await fontcaster.read( html_files_path, false );

    if ( ! read_html_response.success ) return { success: false, error: read_html_response.error };

    const read_txt_response = await fontcaster.read( txt_file_path, true );

    if ( ! read_txt_response.success ) return { success: false, error: read_txt_response.error };

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

    if ( ! subset_response.success ) return { success: false, error: subset_response.error };

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

module.exports = createFontFile;
