const { createInfo } = require( "./createInfo" );
const BASE_MD_PATH = "./markdown";
const BASE_HTML_PATH = "./template/article";
const BASE_BUILD_PATH = "./article";

const createJavascriptInfo = _ => {

    const name = "javascript";
    const alias = "JavaScript";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH;
    const children = [
        { name: "code-structure", alias: "代码结构" },
        { name: "operators", alias: "运算符" },
        { name: "strict-mode", alias: "严格模式" },
        { name: "v8-object", alias: "V8 Object" },
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

const createBrowserInfo = _ => {

    const name = "browser";
    const alias = "Browser";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH;
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

const createLeetcodeInfo = _ => {

    const name = "leetcode";
    const alias = "LeetCode";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH;
    const children = [
        { name: "time-space-complexity", alias: "时间和空间复杂度" },
        { name: "stack", alias: "栈" },
        { name: "queue", alias: "队列" },
        { name: "linked-list", alias: "链表" },
        { name: "set", alias: "集合" },
        { name: "dictionary", alias: "字典" },
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

const createBabelInfo = _ => {

    const name = "babel";
    const alias = "Babel";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH;
    const children = [
        { name: "babel", alias: "Babel7" },
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

const createWebpackInfo = _ => {

    const name = "webpack";
    const alias = "Webpack";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH;
    const children = [
        { name: "webpack", alias: "Webpack5" },
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

const createNpmInfo = _ => {

    const name = "npm";
    const alias = "NPM";
    const md_path = BASE_MD_PATH + "/" + name;
    const html_path = BASE_HTML_PATH + "/" + name;
    const build_path = BASE_BUILD_PATH;
    const children = [
        { name: "npm-base", alias: "npm 基础" },
        { name: "npm-command", alias: "npm 命令" },
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
    const build_path = BASE_BUILD_PATH;
    const children = [
        { name: "semantic-versioning", alias: "语义化版本控制" },
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
        createBrowserInfo(),
        createLeetcodeInfo(),
        createNpmInfo(),
        createBabelInfo(),
        createWebpackInfo(),
        createOtherInfo(),
    ] );

};

module.exports = createAllInfo();
