const { merge } = require( "webpack-merge" );

const common = require( "./public.js" );

module.exports = merge( common, {
    mode: "development",
    devtool: "eval-cheap-module-source-map", // 源码映射（source map文件，映射质量尚可，构建速度尚可）
    devServer: {
        static: "./",     // 静态资源的起寻地址
        compress: false, // gzip压缩
        server: "http",
        port: 8346,
        open: {
            target: [ "./index.html" ],
        },
    },
} );
