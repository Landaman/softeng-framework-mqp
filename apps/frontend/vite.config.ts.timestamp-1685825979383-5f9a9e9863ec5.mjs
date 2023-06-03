// vite.config.ts
import { defineConfig } from "file:///app/.yarn/__virtual__/vite-virtual-4e1bd1817c/0/cache/vite-npm-4.3.9-24f3552941-8c45a51627.zip/node_modules/vite/dist/node/index.js";
import react from "file:///app/.yarn/__virtual__/@vitejs-plugin-react-swc-virtual-414d0f3c8a/0/cache/@vitejs-plugin-react-swc-npm-3.3.1-be9651c9b0-22756c76b6.zip/node_modules/@vitejs/plugin-react-swc/index.mjs";
import eslint from "file:///app/.yarn/__virtual__/vite-plugin-eslint-virtual-1f4e08d8c3/0/cache/vite-plugin-eslint-npm-1.8.1-844ad445f5-65598893e2.zip/node_modules/vite-plugin-eslint/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT),
    proxy: {
      "/api": process.env.BACKEND_SOURCE + ":" + process.env.BACKEND_PORT
    }
  },
  build: {
    outDir: "build"
  },
  plugins: [react(), eslint()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwL2FwcHMvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9hcHAvYXBwcy9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYXBwL2FwcHMvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgZXNsaW50IGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICAgIHBvcnQ6IHBhcnNlSW50KHByb2Nlc3MuZW52LlBPUlQpLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgXCIvYXBpXCI6IHByb2Nlc3MuZW52LkJBQ0tFTkRfU09VUkNFICsgXCI6XCIgKyBwcm9jZXNzLmVudi5CQUNLRU5EX1BPUlQsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogXCJidWlsZFwiLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW3JlYWN0KCksIGVzbGludCgpXSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd08sU0FBUyxvQkFBb0I7QUFDclEsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUduQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNLFNBQVMsUUFBUSxJQUFJLElBQUk7QUFBQSxJQUMvQixPQUFPO0FBQUEsTUFDTCxRQUFRLFFBQVEsSUFBSSxpQkFBaUIsTUFBTSxRQUFRLElBQUk7QUFBQSxJQUN6RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUM3QixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
