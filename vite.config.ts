import path from 'path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solid()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './source'),
            '$': path.resolve(__dirname, './'),
        },
    },
    server: {
        host: true,
        port: 3000,
        open: false,
        https: false,
        strictPort: true,
        cors: true,
    },
    build: {
        outDir: 'dist',
        target: 'esnext',
        assetsInlineLimit: 4096,
        chunkSizeWarningLimit: 1000,
    },
});
