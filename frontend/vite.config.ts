import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: parseInt(process.env.PORT),
        proxy: {
            "/api": process.env.BACKEND_SOURCE + ":" + process.env.BACKEND_PORT
        }
    },
    plugins: [react(), eslint()],
});
