const path = require( "path" );
const { merge } = require( "webpack-merge" );
const public = require( "./public" );

module.exports = merge( public, {
    mode: "development",
    devtool: "eval-cheap-module-source-map", // 源码映射（映射质量尚可，构建速度尚可）
    devServer: {
        static: "./",     // 静态资源的起寻地址（项目根目录）
        compress: false,  // gzip压缩
        server: "http",
        port: 8086,
        open: false,
    },
} );
