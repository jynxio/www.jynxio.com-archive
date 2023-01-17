const { createInfo } = require( "./createInfo" );
const BASE_MD_PATH = "./markdown";
const BASE_HTML_PATH = "./template/article";
const BASE_BUILD_PATH = "./article";

const createJavascriptInfo = _ => {

    const name = "javascript";
    const alias = "JavaScript";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH + "/" + name;
    const children = [
        { name: "code-structure", alias: "代码结构" },
        { name: "operators", alias: "运算符" },
        { name: "strict-mode", alias: "严格模式" },
        { name: "data-type-number", alias: "Number" },
        { name: "v8-jit", alias: "V8 JIT" },
        { name: "v8-object", alias: "V8 Object" },
        { name: "promisesaplus", alias: "Promises/A+" },
        { name: "react-api-manual", alias: "React API" },
    ];
    const options = {
        name,
        alias,
        children,
        mdPath: md_path,
        htmlPath: html_path,
        buildPath: build_path,
    };

    return createInfo( options );

}

const createDataStructureInfo = _ => {

    const name = "data-structure";
    const alias = "Data structure";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH + "/" + name;
    const children = [
        { name: "time-space-complexity", alias: "时间/空间复杂度" },
        { name: "stack", alias: "栈" },
        { name: "queue", alias: "队列" },
        { name: "linked-list", alias: "链表" },
        { name: "set", alias: "集合" },
        { name: "dictionary", alias: "字典" },
        { name: "hash-table", alias: "散列表" },
        { name: "recursion", alias: "递归" },
        { name: "tree", alias: "树" },
        { name: "binary-search-tree", alias: "二叉搜索树" },
        { name: "avl-tree", alias: "AVL 树" },
        { name: "binary-heap", alias: "二叉堆" },
    ];
    const options = {
        name,
        alias,
        children,
        mdPath: md_path,
        htmlPath: html_path,
        buildPath: build_path,
    };

    return createInfo( options );

};

const createBrowserInfo = _ => {

    const name = "browser";
    const alias = "Browser";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH + "/" + name;
    const children = [
        { name: "network-protocol", alias: "网络协议" },
        { name: "browser-architecture", alias: "浏览器的架构" },
        { name: "browser-navigation", alias: "浏览器的导航" },
        { name: "page-rendering", alias: "页面的渲染" },
        { name: "input-event-and-page-scroll", alias: "输入事件与页面滚动" },
    ];
    const options = {
        name,
        alias,
        children,
        mdPath: md_path,
        htmlPath: html_path,
        buildPath: build_path,
    };

    return createInfo( options );

};

const createCssInfo = _ => {

    const name = "css";
    const alias = "CSS";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH + "/" + name;
    const children = [
        { name: "responsive-design", alias: "响应式设计" },
    ];
    const options = {
        name,
        alias,
        children,
        mdPath: md_path,
        htmlPath: html_path,
        buildPath: build_path,
    };

    return createInfo( options );

};

const createOtherInfo = _ => {

    const name = "other";
    const alias = "Others";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH + "/" + name;
    const children = [
        { name: "semantic-versioning", alias: "语义化版本控制" },
        { name: "npm-base", alias: "npm 基础" },
        { name: "npm-command", alias: "npm 命令" },
        { name: "babel-7", alias: "Babel 7" },
        { name: "webpack-5", alias: "Webpack 5" },
    ];
    const options = {
        name,
        alias,
        children,
        mdPath: md_path,
        htmlPath: html_path,
        buildPath: build_path,
    };

    return createInfo( options );

};

const createAllInfo = _ => {

    return ( [
        createJavascriptInfo(),
        createDataStructureInfo(),
        createBrowserInfo(),
        createCssInfo(),
        createOtherInfo(),
    ] );

};

module.exports = createAllInfo();
