/**
 * 从html string中提取出所有标签的内容，然后合并成一段字符串，最后返回这段字符串。
 * @param {string} input - html string（是指字符串形式的html文件的内容），html string中的标签名是不区分大小写的。
 * htmlGenerator方法返回的Promise即代表一个html string。
 * @param {Array} [nodes<string>] - （可选）一个包含零至多个标签名称的数组，比如["code", "strong"]。缺省时，该方法会
 * 提取出所有标签的内容，否则将只提取指定标签的内容。注意：1.不能输入自闭和的标签，比如img（因为该方法无法处理它们）；2.标签的名称不
 * 区分大小写。
 * @returns {string} - 整合了标签内容的字符串。
 */
function extractCharacters( input, nodes ) {

    if ( ! nodes ) return core( input );

    if ( ! nodes.length ) return "";

    const regexp = new RegExp( `</?(${ nodes.join( "|" ) })(>|(\\s*>)|(\\s[^>]*>))`, "ig" );

    const tags = input.match( regexp );

    if ( ! tags ) return "";

    let output = "";
    let from_index_in_tags = 0;
    let from_index_in_input = 0;

    while ( from_index_in_tags < tags.length ) {

        const header = tags[ from_index_in_tags ];
        const footer = header.match( /<[a-z][a-z0-9]*/i )[ 0 ].replace( "<", "</" ) + ">";

        const header_index = from_index_in_tags;
        const footer_index = tags.indexOf( footer, from_index_in_tags );

        const from = input.indexOf( header, from_index_in_input );
        const to = input.indexOf( footer, from_index_in_input ) + footer.length;

        output += core( input.slice( from ,to ) );
        from_index_in_tags = footer_index + 1;
        from_index_in_input = to;

    }

    return output;

    function core( input ) {

        const tags = input.match( /<!?\/?[a-z][a-z0-9]*[^>]*>/ig );

        if ( ! tags ) return "";

        let output = "";
        let from_index = 0;

        tags.forEach( tag => {

            const from = input.indexOf( tag, from_index );
            const snippet = input.slice( from_index, from );

            output += snippet;
            from_index = from + tag.length;

        } );

        return output;

    }

}
