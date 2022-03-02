const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="/style/font.css">
    <link rel="stylesheet" href="/style/resize.css">
    <link rel="stylesheet" href="/style/page.css">
</head>
<body>
    <article>
<h1 id="mdn-web-docs">MDN Web Docs</h1>
<blockquote>
<p>Article excerpted from <a href="https://developer.mozilla.org/"><strong>MDN</strong></a>.</p>
</blockquote>
<p><a href="https://tc39.es/ecma262/">ECMAScript</a>规定了 8 种基本的数据类型，其中有 7 种是<strong>原始类型</strong>，1 种是<strong>引用类型</strong>。在这里，我们将对他们进行大体的介绍，在下一章中，我们将详细讨论它们。</p>
<p>下表罗列了所有的原始类型。</p>
<table>
<thead>
<tr>
<th>原始类型</th>
<th>示例</th>
</tr>
</thead>
<tbody><tr>
<td><code>Number</code></td>
<td><code>const n = 1;</code></td>
</tr>
<tr>
<td><code>String</code></td>
<td><code>const s = &quot;Hello World&quot;;</code></td>
</tr>
<tr>
<td><code>Boolean</code></td>
<td><code>const b = true;</code></td>
</tr>
<tr>
<td><code>Undefined</code></td>
<td><code>const u = undefined;</code></td>
</tr>
<tr>
<td><code>Null</code></td>
<td><code>const n = null;</code></td>
</tr>
<tr>
<td><code>Symbol</code></td>
<td><code>const s = Symbol( 1 );</code></td>
</tr>
<tr>
<td><code>BigInt</code></td>
<td><code>const b = 9007199254740991n;</code></td>
</tr>
</tbody></table>
<p>引用类型只有一种，那就是 <code>Object</code> 。</p>
<h2 id="标准内置对象">标准内置对象</h2>
<p>JavaScript 中有许多<strong>标准内置对象</strong>，比如<strong>可索引的集合对象</strong>有：</p>
<ul>
<li><code>Array</code></li>
<li><code>Int8Array</code></li>
<li><code>Unit8Array</code></li>
<li>......</li>
</ul>
<h3 id="array">Array</h3>
<p>JavaScript 的 <code>Array</code> 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。下列任务列表罗列的 <code>Array.prototype.at</code> 方法在 PC 浏览器中的兼容性情况。</p>
<ul>
<li><input checked="" disabled="" type="checkbox"> Chrome</li>
<li><input checked="" disabled="" type="checkbox"> Edge</li>
<li><input checked="" disabled="" type="checkbox"> FireFox</li>
<li><input disabled="" type="checkbox"> Internet Explore</li>
<li><input checked="" disabled="" type="checkbox"> Opera</li>
<li><input checked="" disabled="" type="checkbox"> Safari</li>
</ul>
<h4 id="arrayprototypesplice">Array.prototype.splice</h4>
<p>The <code>splice()</code> method changes the contents of an array by removing or replacing existing elements and/or adding new elements <a href="https://en.wikipedia.org/wiki/In-place_algorithm">in place</a>. To access part of an array without modifying it, see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice"><code>slice()</code></a>.</p>
<h5 id="syntax">Syntax</h5>
<pre><code class="language-js">splice( start );
splice( start, deleteCount );
splice( start, deleteCount, item1 );
splice( start, deleteCount, item1, item2, itemN );
</code></pre>
<h6 id="parameters">Parameters</h6>
<ol>
<li><p><code>start</code></p>
<p>The index at which to start changing the array.</p>
<p>If greater than the length of the array, <code>start</code> will be set to the length of the array. In this case, no element will be deleted but the method will behave as an adding function, adding as many elements as items provided.</p>
<p>If negative, it will begin that many elements from the end of the array. (In this case, the origin <code>-1</code>, meaning <code>-n</code> is the index of the <code>n</code>th last element, and is therefore equivalent to the index of <code>array.length - n</code>.) If <code>start</code> is <code>negative infinity</code>, it will begin from index <code>0</code>.</p>
</li>
<li><p><code>deleteCount</code> <strong><code>Optional</code></strong></p>
<p>An integer indicating the number of elements in the array to remove from <code>start</code>.</p>
<p>If <code>deleteCount</code> is omitted, or if its value is equal to or larger than <code>array.length - start</code> (that is, if it is equal to or greater than the number of elements left in the array, starting at <code>start</code>), then all the elements from <code>start</code> to the end of the array will be deleted. However, it must not be omitted if there is any <code>item1</code> parameter.</p>
<p>If <code>deleteCount</code> is <code>0</code> or negative, no elements are removed. In this case, you should specify at least one new element (see below).</p>
</li>
<li><p><code>item1, item2, ...</code> <strong><code>Optional</code></strong></p>
<p>The elements to add to the array, beginning from <code>start</code>.</p>
<p>If you do not specify any elements, <code>splice()</code> will only remove elements from the array.</p>
</li>
</ol>
<h6 id="return-value">Return value</h6>
<p>An array containing the deleted elements.</p>
<p>If only one element is removed, an array of one element is returned.</p>
<p>If no elements are removed, an empty array is returned.</p>
<h5 id="example">Example</h5>
<pre><code class="language-js">/* 插入新元素&quot;b&quot; */
const array = [ &quot;a&quot;, &quot;c&quot;, &quot;d&quot; ];
const removed = array.splice( 1, 0, &quot;b&quot; )

console.log( removed ); // output: []
console.log( array );   // output: [ &quot;a&quot;, &quot;b&quot;, &quot;c&quot;, &quot;d&quot; ]
</code></pre>
<p><img src="/static/page-image-hosting/mozilla-logo.png" alt="mozilla-logo"></p>
<hr>
<h1 id="next-topic">Next topic...</h1>

    </article>
</body>
</html>
`;

const characters_set = extractText( html, [ "a" ] );

console.log( characters_set );

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

/**
 * 从html文件中提取出所有或指定标签的内容，然后合并成一段新的字符串，最后返回这段新的字符串。
 * @param {string} input - html文件的内容，是一串字符串。注意，html文件的标签名称不区分大小写。
 * @param {Array} [node_names] - 一个数组，它包含了零至多个标签的名称，比如["h1", "p"]。缺省时，返回结果将包含所有标签的内容，
 *                               否则返回结果将只包含指定标签的内容。注意，1.不能输入自闭合标签；2.标签名称不区分大小写。
 * @returns {string} - 一个字符串，它包含了html文件中的所有标签的内容。
 */
function _extractText( input, node_names ) {

    if ( !Array.isArray( node_names ) ) return removeTokenFromString( input );

    if ( !node_names.length ) return "";

    /* 提取标签 */
    const regexp = new RegExp( `</?(${ node_names.join( "|" ) })(>|(\\s*>)|(\\s[^>]*>))`, "ig" );
    const tokens = input.match( regexp );

    if ( !tokens ) return "";
    console.log( tokens ); // TODO 这一步是对的
    let output = "";
    let from_index = 0;

    for ( let i = 0; i < tokens.length - 1; i++ ) {
        debugger;
        const starting_index = input.indexOf( tokens[ i ], from_index ) + tokens[ i ].length;
        const endding_index = input.indexOf( tokens[ i + 1 ], from_index );
        const slice = input.slice( starting_index, endding_index );
        const snippet = removeTokenFromString( slice );

        output += snippet;
        from_index = endding_index;

    }

    return output;

    /**
     * 剔除掉字符串内的html标签，返回一段新的字符串，不会改变原字符串。
     * @param {string} input - 一段字符串，它包含零至多个html标签，比如"asjd</a>asjdoi"。
     * @returns {string} - 一段字符串，它在原字符串的基础上，剔除了所有的html标签。
     */
    function removeTokenFromString( input ) {

        let output = "";
        let starting_index = 0;

        const tokens = input.match( /<!?\/?[a-z][a-z0-9]*[^>]*>/ig );

        if ( !tokens ) return "";

        tokens.forEach( token => {

            const endding_index = input.indexOf( token, starting_index );
            const next_starting_index = endding_index + token.length;
            const snippet = input.slice( starting_index, endding_index );

            output += snippet;
            starting_index = next_starting_index;

        } );

        return output;

    }

}
