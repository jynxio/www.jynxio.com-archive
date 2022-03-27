const fontcaster = require( "font-caster" );

const readlineSync = require( "readline-sync" );

/**
 * =====================================================================
 * Usage: 通过更改下述常量来控制函数的行为。
 * =====================================================================
 */

/* 新增的html文件的路径。 */
const NEW_HTML_PATH = "./page/example.html";

/* 所有html文件的路径。 */
const ALL_HTML_PATH = "./page";

/* 原始的字体文件的路径。 */
const ORIGIN_FONT_PATH_EN_400 = "./static/font/origin-en-400.ttf";
const ORIGIN_FONT_PATH_EN_700 = "./static/font/origin-en-700.ttf";
const ORIGIN_FONT_PATH_ZH_400 = "./static/font/origin-zh-400.woff";
const ORIGIN_FONT_PATH_ZH_700 = "./static/font/origin-zh-700.woff";
const ORIGIN_FONT_PATH_CO_400 = "./static/font/origin-co-400.ttf";

/* 子集化的字体文件的路径。 */
const SUBSET_FONT_PATH_EN_400 = "./static/font/subset-en-400.ttf";
const SUBSET_FONT_PATH_EN_700 = "./static/font/subset-en-700.ttf";
const SUBSET_FONT_PATH_ZH_400 = "./static/font/subset-zh-400.woff";
const SUBSET_FONT_PATH_ZH_700 = "./static/font/subset-zh-700.woff";
const SUBSET_FONT_PATH_CO_400 = "./static/font/subset-co-400.ttf";

/* unicode文本的路径。 */
const UNICODES_PATH_EN_400 = "./static/font/unicodes-en-400.txt";
const UNICODES_PATH_EN_700 = "./static/font/unicodes-en-700.txt";
const UNICODES_PATH_ZH_400 = "./static/font/unicodes-zh-400.txt";
const UNICODES_PATH_ZH_700 = "./static/font/unicodes-zh-700.txt";
const UNICODES_PATH_CO_400 = "./static/font/unicodes-co-400.txt";

async function subsetFontFromOneHtml() {

    /* Insurance */
    const password = `subsetFontFromOneHtml( ${ NEW_HTML_PATH } )`;
    const command = readlineSync.question( `🟢 Please type ${ password } to confirm: \n` );

    if ( command !== password ) {

        console.log( "🔴 The command is wrong" );

        return;

    }

    /* Subset en-400 */
    console.log( "🟢 Subsetting EN-400" );

    const r_en_400 = await subsetFontCore(

        NEW_HTML_PATH,

        UNICODES_PATH_EN_400,

        ORIGIN_FONT_PATH_EN_400,

        SUBSET_FONT_PATH_EN_400,

        undefined,

    );

    if ( ! r_en_400.success ) {

        console.error( "🔴 Error: ", r_en_400.error );

        return;

    }

    /* Subset en-700 */
    console.log( "🟢 Subsetting EN-700" );

    const r_en_700 = await subsetFontCore(

        NEW_HTML_PATH,

        UNICODES_PATH_EN_700,

        ORIGIN_FONT_PATH_EN_700,

        SUBSET_FONT_PATH_EN_700,

        [ "h1", "h2", "h3", "h4", "strong" ],

    );

    if ( ! r_en_700.success ) {

        console.error( "🔴 Error: ", r_en_700.error );

        return;

    }

    /* Subset zh-400 */
    console.log( "🟢 Subsetting ZH-400" );

    const r_zh_400 = await subsetFontCore(

        NEW_HTML_PATH,

        UNICODES_PATH_ZH_400,

        ORIGIN_FONT_PATH_ZH_400,

        SUBSET_FONT_PATH_ZH_400,

        undefined,

    );

    if ( ! r_zh_400.success ) {

        console.error( "🔴 Error: ", r_zh_400.error );

        return;

    }

    /* Subset zh-700 */
    console.log( "🟢 Subsetting ZH-700" );

    const r_zh_700 = await subsetFontCore(

        NEW_HTML_PATH,

        UNICODES_PATH_ZH_700,

        ORIGIN_FONT_PATH_ZH_700,

        SUBSET_FONT_PATH_ZH_700,

        [ "h1", "h2", "h3", "h4", "strong" ],

    );

    if ( ! r_zh_700.success ) {

        console.error( "🔴 Error: ", r_zh_700.error );

        return;

    }

    /* Subset co-400 */
    console.log( "🟢 Subsetting CO-400" );

    const r_co_400 = await subsetFontCore(

        NEW_HTML_PATH,

        UNICODES_PATH_CO_400,

        ORIGIN_FONT_PATH_CO_400,

        SUBSET_FONT_PATH_CO_400,

        [ "code", "pre" ],

    );

    if ( ! r_co_400.success ) {

        console.error( "🔴 Error: ", r_co_400.error );

        return;

    }

    console.log( "🟢 Done" );

}

async function subsetFontFromAllHtml() {

    /* Insurance */
    const password = `subsetFontFromAllHtml( ${ ALL_HTML_PATH } )`;
    const command = readlineSync.question( `🟢 Please type ${ password } to confirm: \n` );

    if ( command !== password ) {

        console.log( "🔴 The command is wrong" );

        return;

    }

    /* Clear unicodes txt file */
    let is_clear_success = true;

    const r_cs = await Promise.all( [

        fontcaster.write( "", UNICODES_PATH_EN_400 ),
        fontcaster.write( "", UNICODES_PATH_EN_700 ),
        fontcaster.write( "", UNICODES_PATH_ZH_400 ),
        fontcaster.write( "", UNICODES_PATH_ZH_700 ),
        fontcaster.write( "", UNICODES_PATH_CO_400 ),

    ] );

    r_cs.forEach( r_c => {

        if ( r_c.success ) return;

        is_clear_success = false;

        console.error( "🔴 Error: ", r_c.error );

    } );

    if ( ! is_clear_success ) return;

    /* Subset en-400 */
    console.log( "🟢 Subsetting EN-400" );

    const r_en_400 = await subsetFontCore(

        ALL_HTML_PATH,

        UNICODES_PATH_EN_400,

        ORIGIN_FONT_PATH_EN_400,

        SUBSET_FONT_PATH_EN_400,

        undefined,

    );

    if ( ! r_en_400.success ) {

        console.error( "🔴 Error: ", r_en_400.error );

        return;

    }

    /* Subset en-700 */
    console.log( "🟢 Subsetting EN-700" );

    const r_en_700 = await subsetFontCore(

        ALL_HTML_PATH,

        UNICODES_PATH_EN_700,

        ORIGIN_FONT_PATH_EN_700,

        SUBSET_FONT_PATH_EN_700,

        [ "h1", "h2", "h3", "h4", "strong" ],

    );

    if ( ! r_en_700.success ) {

        console.error( "🔴 Error: ", r_en_700.error );

        return;

    }

    /* Subset zh-400 */
    console.log( "🟢 Subsetting ZH-400" );

    const r_zh_400 = await subsetFontCore(

        ALL_HTML_PATH,

        UNICODES_PATH_ZH_400,

        ORIGIN_FONT_PATH_ZH_400,

        SUBSET_FONT_PATH_ZH_400,

        undefined,

    );

    if ( ! r_zh_400.success ) {

        console.error( "🔴 Error: ", r_zh_400.error );

        return;

    }

    /* Subset zh-700 */
    console.log( "🟢 Subsetting ZH-700" );

    const r_zh_700 = await subsetFontCore(

        ALL_HTML_PATH,

        UNICODES_PATH_ZH_700,

        ORIGIN_FONT_PATH_ZH_700,

        SUBSET_FONT_PATH_ZH_700,

        [ "h1", "h2", "h3", "h4", "strong" ],

    );

    if ( ! r_zh_700.success ) {

        console.error( "🔴 Error: ", r_zh_700.error );

        return;

    }

    /* Subset co-400 */
    console.log( "🟢 Subsetting CO-400" );

    const r_co_400 = await subsetFontCore(

        ALL_HTML_PATH,

        UNICODES_PATH_CO_400,

        ORIGIN_FONT_PATH_CO_400,

        SUBSET_FONT_PATH_CO_400,

        [ "code", "pre" ],

    );

    if ( ! r_co_400.success ) {

        console.error( "🔴 Error: ：", r_co_400.error );

        return;

    }

    console.log( "🟢 Done" );

}

/**
 * （异步）字体子集化。
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
 * @returns { Promise } - Promise代表是否执行成功，若失败，则返回{success: false, error}对象；若成功，则返回
 * {success, true, information}对象，参考subset API。
 */
async function subsetFontCore(

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

        const response = await fontcaster.write( unicodes, unicode_path );

        if ( ! response.success ) return { success: false, error: response.error };

    }

    /* 执行字体子集化。 */
    {

        const response = await fontcaster.subset( characters, origin_font_path, subset_font_path );

        if ( ! response.success ) return { success: false, error: response.error };

        return { success: true, information: response.information };

    }

}

module.exports = { subsetFontFromOneHtml, subsetFontFromAllHtml };
