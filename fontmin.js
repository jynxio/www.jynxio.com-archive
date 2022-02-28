const Fontmin = require( "fontmin" );

/* 待处理的字体文件的路径字符串 */
const input = "./static/font/NotoSansSC-Thin.ttf";
/* 文件夹路径，生成结果将会存储在该文件夹中 */
const output = "./static/fontmin-test";
/* 字符子集 */
const character_set = "我们将对他们";

const fontmin = new Fontmin()
    .src( input )
    .use( Fontmin.glyph( { text: character_set } ) )
    .use( Fontmin.ttf2woff2() )
    .dest( output );

fontmin.run( function( error, files, stream ) {

    if ( error ) {

        throw error;

    }

    console.log( "Done!" );

} );