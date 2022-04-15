const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

module.exports = {
    entry: {
        article: "./source/article/index.js",
        home: "./source/home/index.js",
    },
    output: {
        path: path.resolve( __dirname, "../dist" ),
        filename: "js/[name].js",
        clean: true,
        pathinfo: false,
    },
    plugins: [
        new MiniCssExtractPlugin( {
            filename: "css/[name].css"
        } ),
        new HtmlWebpackPlugin( {
            filename: "index.html",
            template: "./template/home/index.html",
            chunks: [ "home" ],
        } ),
        new HtmlWebpackPlugin( {
            filename: "test.html",
            template: "./template/article/test/test.html",
            chunks: [ "article" ],
        } ),
        new HtmlWebpackPlugin( {
            filename: "code-structure.html",
            template: "./template/article/javascript/code-structure.html",
            chunks: [ "article" ],
        } ),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: [ "html-loader" ],
            },
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, "css-loader" ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "static/img/[hash][ext][query]",
                },
            },
            {
                test: /\.json$/i,
                type: "asset/source",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "static/font/[hash][ext][query]"
                },
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/i,
                type: "asset/source",
            }
        ],
    },
};
