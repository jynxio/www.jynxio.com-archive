
function extractCharacters( html_content, tag_names ) {}

/**
 * 从html文件中提取出所有或指定标签的内容，然后合并成一段新的字符串，最后返回这段新的字符串。
 * @param {string} input - html文件的内容，是一串字符串。注意，html文件的标签名称不区分大小写。
 * @param {Array} [node_names] - 一个数组，它包含了零至多个标签的名称，比如["h1", "p"]。缺省时，返回结果将包含所有标签的内容，
 *                               否则返回结果将只包含指定标签的内容。注意，1.不能输入自闭合标签；2.标签名称不区分大小写。
 * @returns {string} - 一个字符串，它包含了html文件中的所有标签的内容。
 */
function extractText( input, nodes ) {

    if ( !Array.isArray( nodes ) ) return core( input );

    if ( !nodes.length ) return "";

    const regexp = new RegExp( `</?(${ nodes.join( "|" ) })(>|(\\s*>)|(\\s[^>]*>))`, "ig" );
    const tags = input.match( regexp );

    if ( !tags ) return "";

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

        if ( !tags ) return "";

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