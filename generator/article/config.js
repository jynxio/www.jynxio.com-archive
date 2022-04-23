export default [
    ... createTestScroped(),
    ... createJavascriptScroped(),
    ... createBabelScroped(),
    ... createWebpackScroped(),
    ... createNpmScroped(),
    ... createOtherScroped(),
];

function createTestScroped() {

    const base_input = "./markdown/test/";
    const base_output = "./template/article/test/";
    const file_names = [
        "test",
    ];

    return createScroped( base_input, base_output, file_names );

}

function createJavascriptScroped() {

    const base_input = "./markdown/javascript/";
    const base_output = "./template/article/javascript/";
    const file_names = [
        "code-structure",
        "operators",
        "strict-mode",
    ];

    return createScroped( base_input, base_output, file_names );

}

function createBabelScroped() {

    const base_input = "./markdown/babel/";
    const base_output = "./template/article/babel/";
    const file_names = [
        "babel",
    ];

    return createScroped( base_input, base_output, file_names );

}

function createWebpackScroped() {

    const base_input = "./markdown/webpack/";
    const base_output = "./template/article/webpack/";
    const file_names = [
        "webpack",
    ];

    return createScroped( base_input, base_output, file_names );

}

function createNpmScroped() {

    const base_input = "./markdown/npm/";
    const base_output = "./template/article/npm/";
    const file_names = [
        "npm",
    ];

    return createScroped( base_input, base_output, file_names );

}

function createOtherScroped() {

    const base_input = "./markdown/other/";
    const base_output = "./template/article/other/";
    const file_names = [
        "semantic-versioning",
    ];

    return createScroped( base_input, base_output, file_names );

}

/**
 * 创建scroped。
 * @param { string } base_input_path - md文件的基础路径，比如"./markdown/test/"。
 * @param { string } base_output_path - html文件的基础路径，比如"./template/article/test/"。
 * @param { Array<string> } file_names - 存储所有md文件名称的数组，比如[ "test" ]。
 * @returns { Object } - 比如[ { input: "./markdown/test/test.md", output: "./template/article/test/test.html" } ]。
 */
function createScroped( base_input_path, base_output_path, file_names ) {

    return file_names.map( file_name => {

        return {
            name: file_name + ".md",
            input: base_input_path + file_name + ".md",
            output: base_output_path + file_name + ".html",
        };

    } );

}

function IndexGenerator() {

    const generator = createGenerator();

    return ( _ => generator.next().value );

    function* createGenerator() {

        let count = 0;

        while ( true ) yield ++count;

    }

}
