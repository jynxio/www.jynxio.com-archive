const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );

module.exports = {
    entry: {
        home: "./source/home/index.js",
        article: "./source/article/index.js",
        catalogue: "./source/catalogue/index.js",
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
        // index
        new HtmlWebpackPlugin( {
            filename: "index.html",
            template: "./template/home/index.html",
            chunks: [ "home" ],
        } ),
        // catalogue
        new HtmlWebpackPlugin( {
            filename: "catalogue.html",
            template: "./template/catalogue/index.html",
            chunks: [ "catalogue" ],
        } ),
        // article -> babel
        new HtmlWebpackPlugin( {
            filename: "./article/babel/babel.html",
            template: "./template/article/babel/babel.html",
            chunks: [ "article" ],
        } ),
        // article -> javascript
        new HtmlWebpackPlugin( {
            filename: "./article/javascript/code-structure.html",
            template: "./template/article/javascript/code-structure.html",
            chunks: [ "article" ],
        } ),
        new HtmlWebpackPlugin( {
            filename: "./article/javascript/operators.html",
            template: "./template/article/javascript/operators.html",
            chunks: [ "article" ],
        } ),
        new HtmlWebpackPlugin( {
            filename: "./article/javascript/strict-mode.html",
            template: "./template/article/javascript/strict-mode.html",
            chunks: [ "article" ],
        } ),
        // article -> others
        new HtmlWebpackPlugin( {
            filename: "./article/others/semantic-versioning.html",
            template: "./template/article/others/semantic-versioning.html",
            chunks: [ "article" ],
        } ),
        // article -> test
        new HtmlWebpackPlugin( {
            filename: "./article/test/test.html",
            template: "./template/article/test/test.html",
            chunks: [ "article" ],
        } ),
        // article -> webpack
        new HtmlWebpackPlugin( {
            filename: "./article/webpack/webpack.html",
            template: "./template/article/webpack/webpack.html",
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
