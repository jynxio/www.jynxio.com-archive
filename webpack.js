const path = require( "path" );

const HtmlWebpackPlugin = require( "html-webpack-plugin" );

module.exports = {
    entry: "./source/index.js",
    plugins: [
        new HtmlWebpackPlugin( { title: "" } ),
    ],
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
        filename: "home.js",
        path: path.resolve( __dirname, "../style/home" ),
        clean: true,                                // 清除生成目录。
        pathinfo: false,                            // 提升构建性能：通过禁止为bundle生成模块的路径信息，以提高垃圾回收的性能，从而提高构建性能。
    },
    mode: "development",
    devtool: false, // 禁用源码映射（禁止生成source map）
    devServer: {
        static: "./",                        // 资源的起寻地址。
        compress: false,                     // gzip。
        server: "http",                      // 网络传输协议。
        port: 8897,                          // 端口号。
        open: {
            target: [ "./index.html" ],
        },
    },
};

// TODO
