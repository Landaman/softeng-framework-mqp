import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(<string>process.env.PORT),
    proxy: {
      "/api": process.env.BACKEND_SOURCE + ":" + process.env.BACKEND_PORT,
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "build",
  },
  plugins: [react(), eslint()],
});
