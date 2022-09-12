const { merge } = require( "webpack-merge" );
const CssMinimizerPlugin = require( "css-minimizer-webpack-plugin" );
const public = require( "./public" );

module.exports = merge( public, {
    mode: "production",
    optimization: {
        minimizer: [
            "...",                    // 压缩bundle的js。
            new CssMinimizerPlugin(), // 压缩bundle的css。
        ],
    },
} );
