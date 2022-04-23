const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const configuration = require( "./configArticle" );

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
            chunks: [ "home" ],
        } ),
        // Catalogue
        new HtmlWebpackPlugin( {
            filename: "catalogue.html",
            template: "./template/catalogue/index.html",
            chunks: [ "catalogue" ],
        } ),
        // Article
        ... configuration.map( item => (
            new HtmlWebpackPlugin( {
                filename: item.filename, // TODO 这里可以改一下，把base路径放在该文件中。
                template: item.template,
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
