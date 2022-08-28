/**
 * 根据入参来构建一个普通对象，这个普通对象描述了如何转译与打包md文件。
 * @param { Object } options - 配置参数。
 * @param { string } options.name - 文件夹的名称，该文件夹用于存储某种类目的md文件，比如：若存储js类目的md文件的文件夹的名称为javascript，则该参数即为"javascript"。
 * @param { string } options.alias - 文件夹的别名，自动创建catalogue.html的脚本将会根据该别名来创建栏目，比如：若该参数为"JavaScript"，则脚本创建的catalogue.html
 * 文件中将会含有一个名为"JavaScript"的栏目。
 * @param { string } options.mdPath - 文件夹的路径，该文件夹用于存储某种类目的md文件，比如"./markdown/javascript"。
 * @param { string } options.htmlPath - 文件夹的路径，该文件夹用于存储某种类目的html文件，这些html文件由md文件转译而来，比如"./template/article/javascript"。
 * @param { string } options.buildPath - 文件夹的路径，该文件夹用于存储打包后的html文件，比如：若这些html文件将被打包至dist目录下的article文件夹中，则该参数为
 * "./article"。
 * @param { Array } options.children - 数组，格式是[ { name: "", alias: "" }, ... ]，其内的普通对象代表md文件夹下的md文件，name代表md文件的文件名，alias代表md
 * 文件的别名，自动创建catalogue.html的脚本将会根据该别名来生成文章名。
 * @returns { Object } - 对象，格式是{ name: "", alias: "", children: [ { name: "", alias: "", mdPath: "", htmlPath: "", buildPath: "" }, ... ] }，
 * name属性代表该md文件夹的文件名，alias属性代表该md文件夹的别名，children下的name属性代表md文件的文件名，children下的alias属性代表md文件的别名，mdPath代表md文件的路径，
 * htmlPath代表由md文件转译生成的html文件的路径，buildPath代表html文件打包后的存储路径。
 */
function createInfo( {
    name,
    alias,
    children,
    mdPath,
    htmlPath,
    buildPath,
} ) {

    const info = {};

    info.name = name;
    info.alias = alias;
    info.children = children.map( md_file => {

        const its_name = md_file.name;
        const its_alias = md_file.alias;
        const its_md_path = mdPath + "/" + its_name + ".md";
        const its_html_path = htmlPath + "/" + its_name + ".html";
        const its_build_path = buildPath + "/" + its_name + ".html";

        return ( {
            name: its_name,
            alias: its_alias,
            mdPath: its_md_path,
            htmlPath: its_html_path,
            buildPath: its_build_path,
        } );

    } );

    return info;

}

module.exports = { createInfo };
