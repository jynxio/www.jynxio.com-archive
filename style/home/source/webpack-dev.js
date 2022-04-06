const { merge } = require( "webpack-merge" );

const common = require( "./webpack-common" );

module.exports = merge( common, {
    mode: "development",
    devtool: "eval-cheap-module-source-map", // 激活源码映射：它既能提供质量较好的源码映射，又能提供较高的构建速度。
    devServer: {
        static: "/",     // 静态资源的起寻地址
        compress: false, // gzip压缩
        server: "http",
        port: 8818,
        open: {
            target: [ "/index.html" ],
        },
    },
} );
