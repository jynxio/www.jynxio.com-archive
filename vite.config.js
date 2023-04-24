import path from "path";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite";

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
			root: "./",
			base: "/",
			publicDir: "public",
			resolve: {
				alias: {
					"@": path.resolve( __dirname, "./source" ),
					"$": path.resolve( __dirname, "./" ),
				},
			},
			server: {
				host: true,
				port: 8080,
				open: true,
				https: false,
				strictPort: true,
				cors: true,
			},
		};

	}

	function createProductionEnvironment () {

		return {
			plugins: [ solid() ],
			root: "./",
			base: "/",
			publicDir: "public",
			resolve: {
				alias: {
					"@": path.resolve( __dirname, "./source" ),
					"$": path.resolve( __dirname, "./" ),
				},
			},
			build: {
				outDir: "dist",
				target: "esnext",
				assetsInlineLimit: 4096,
				chunkSizeWarningLimit: 1000,
			},
		};

	}

} );
