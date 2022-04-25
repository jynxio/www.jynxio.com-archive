const fs = require( "fs" );

/**
 * （异步）生成基于utf8编码的文本文件。
 * @param { string } data - 字符串。
 * @param { string } path - 文本文件的存储地址。
 * @returns { Promise } - Promise代表是否生成成功，若成功则返回{success: true}对象，否则返回{success: false, error}对象。
 */
function write( data, path ) {

    return new Promise( resolve => {

        fs.writeFile( path, data, "utf8", error => {

            resolve( error ? { success: false, error } : { success: true } );

        } );

    } );

}

module.exports = { write };
