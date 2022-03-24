const fontcaster = require( "font-caster" );
const castFont = require( "./font-caster/index" );

const html_files_path = "./page";
const txt_file_path = "./static/font/character-set.txt";
const origin_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular.woff";
const subset_font_path = "./static/font/noto-sans-sc-v24-chinese-simplified-regular-subset.woff"

castFont( html_files_path, txt_file_path, origin_font_path, subset_font_path ).then( response => {

    if ( ! response.success ) return;

    console.log( "SUCCESS!" );

} );


// TODO 已经完成自动化的字体subset了
// TODO 下一件事是做什么？优化一下subset脚本和当前脚本？
