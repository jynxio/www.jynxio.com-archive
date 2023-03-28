import { defineConfig } from "vite";

import solid from "vite-plugin-solid";

export default defineConfig( ( { command, mode } ) => {

	console.log( "mode ->", mode );
	console.log( "command ->", command );

	switch ( command ) {

	case "serve":
		return createDevelopmentEnvironment();

	case "build":
		return createProductionEnvironment();

	default:
		throw new Error( "Unknown type" );

	}

	function createDevelopmentEnvironment () {

		return {
			plugins: [ solid() ],
			base: "/",
			publicDir: "public",
			server: {
				host: true,
				port: 8080,
				open: true,
				https: false,     // 使用@vitejs/plugin-basic-ssl来创建一个自签名的证书，详见https://cn.vitejs.dev/config/server-options.html#server-https
				strictPort: true, // 若端口已被占用，则会直接退出
				cors: true,       // 允许访问跨域资源
			},
		};

	}

	function createProductionEnvironment () {

		return {
			plugins: [ solid() ],
			base: "./",
			publicDir: "public",
			build: {
				outDir: "build",
				target: "esnext",
				assetsInlineLimit: 4096,     // 体积小于该值的资源将被转译为base64数据
				chunkSizeWarningLimit: 1000, // Chunk体积报警的触发阈值
			},
		};

	}

} );
