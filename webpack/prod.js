const { merge } = require( "webpack-merge" );
const CssMinimizerPlugin = require( "css-minimizer-webpack-plugin" );
const public = require( "./public" );

module.exports = merge( public, {
    mode: "production",
    devtool: false,                   // 源码映射（source map文件）
    optimization: {
        minimizer: [
            "...",                    // 压缩bundle的js。
            new CssMinimizerPlugin(), // 压缩bundle的css。
        ],
    },
} );
