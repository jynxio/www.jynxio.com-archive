const { merge } = require( "webpack-merge" );

const common = require( "./webpack.common" );

const CssMinimizerPlugin = require( "css-minimizer-webpack-plugin" );

module.exports = merge( common, {
    mode: "production",
    devtool: false,                   // 源码映射（source map文件）
    optimization: {
        minimizer: [
            "...",                    // 压缩bundle的js。
            new CssMinimizerPlugin(), // 压缩bundle的css。
        ],
    },
} );
