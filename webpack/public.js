const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const configuration = require( "./config" );

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
        // Index
        new HtmlWebpackPlugin( {
            filename: "index.html",
            template: "./template/home/index.html",
            favicon: "./static/image/favicon/favicon.ico",
            chunks: [ "home" ],
        } ),
        // Catalogue
        new HtmlWebpackPlugin( {
            filename: "catalogue.html",
            template: "./template/catalogue/index.html",
            favicon: "./static/image/favicon/favicon.ico",
            chunks: [ "catalogue" ],
        } ),
        // Article
        ... configuration.map( path => (
            new HtmlWebpackPlugin( {
                filename: path.filename,
                template: path.template,
                favicon: "./static/image/favicon/favicon.ico",
                chunks: [ "article" ],
            } )
        ) ),
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
