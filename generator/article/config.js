const config = [];
const createIndexName = ( function() {

    const generator = createGenerator();

    return ( _ => generator.next().value );

    function* createGenerator() {

        let count = 0;

        while ( true ) yield ( ++count + "" );

    }

} )();

/* javascript区 */
{

    const options = {
        name: "JavaScript",
        baseInputPath: "./markdown/javascript/",
        baseOutputPath: "./template/article/javascript/",
        content: [
            { enName: "code-structure", zhName: "代码结构", indexName: createIndexName() },
            { enName: "operators", zhName: "运算符", indexName: createIndexName() },
            { enName: "strict-mode", zhName: "严格模式", indexName: createIndexName() },
        ],
    };

    config.push( createScope( options ) );

}

/* babse区 */
{

    const options = {
        name: "Babel",
        baseInputPath: "./markdown/babel/",
        baseOutputPath: "./template/article/babel/",
        content: [
            { enName: "babel", zhName: "Babel7", indexName: createIndexName() },
        ],
    };

    config.push( createScope( options ) );

}

/* webpack区 */
{

    const options = {
        name: "Webpack",
        baseInputPath: "./markdown/webpack/",
        baseOutputPath: "./template/article/webpack/",
        content: [
            { enName: "webpack", zhName: "Webpack5", indexName: createIndexName() },
        ],
    };

    config.push( createScope( options ) );

}

/* other区 */
{

    const options = {

        name: "Others",
        baseInputPath: "./markdown/other/",
        baseOutputPath: "./template/article/other/",
        content: [
            { enName: "semantic-versioning", zhName: "语意化版本控制", indexName: createIndexName() },
        ],
    };

    config.push( createScope( options ) );

}

module.exports = config;

/**
 * 生成一个对象，该对象用于描述如何将md文件转译为html文件，同时catalogue也需要根据该对象来自动生成栏目。
 * @param { Object } options - 参数。
 * @param { string } options.name - 域名，catalogue需要根据该域名来创建栏目，栏目名即为域名。
 * 域名在此处指代存储md文件的文件夹的别名，比如对于javascript文件夹，它的域名（建议）是JavaScript。
 * @param { Array<string> } options.content - 域的内容，它是[ { enName: "", zhName: "", indexName: "" }]
 * 格式的数组，catalogue需要根据enName、baseInputPath、baseOutputPath来确定输入的md文件的地址和输
 * 出的html文件的地址，catalogue需要根据zhName来创建文章名，webpack需要根据indexName来确定html打包
 * 时的名称。
 * @param { string } baseInputPath - 存储md文件的文件夹的路径，比如对于javascript文件夹，
 * 它的路径是"./markdown/javascript/"。
 * @param { string } baseOutputPath - 存储生成的html文件的文件夹的路径，比如由javascript
 * 文件夹中的md所生成的html文件，应存储在"./template/article/javascript/"。
 * @returns { Object } - 它是{ name: "", content: [ ... ] }格式的对象，content字段是
 * [ { enName: "", zhName: "", indexName: "", baseInputPath: "", baseOutputPath: "" }]
 * 格式的数组。
 */
function createScope( {
    name,
    content,
    baseInputPath,
    baseOutputPath,
} ) {

    return ( {
        name,
        content: content.map( item => ( {
            enName: item.enName,
            zhName: item.zhName,
            indexName: item.indexName,
            inputPath: baseInputPath + item.enName + ".md",
            outputPath: baseOutputPath + item.enName + ".html",
        } ) ),
    } );

}
