const path = require( "path" );

module.exports = {
    entry: "./factory/home/index.js",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ "style-loader", "css-loader" ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/i,
                type: "asset/source",
                generator: {
                    filename: "assets/images/[hash][ext]",
                }
            }
        ],
    },
    output: {
        filename: "index.js",
        path: path.resolve( __dirname, "../../style/home" ),
        clean: false,    // 清除生成目录。
        pathinfo: false, // 提升构建性能：通过禁止为bundle生成模块的路径信息，以提高垃圾回收的性能，从而提高构建性能。
    },
};