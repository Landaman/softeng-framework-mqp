import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    host: "0.0.0.0",
    watch: {
      usePolling: true
    }
  },
  test: {
    api: {
      port:  parseInt(<string>process.env["PORT"]),
      host: "0.0.0.0",
    },
  },
});