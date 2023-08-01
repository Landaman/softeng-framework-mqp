import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    api: {
      port:  parseInt(<string>process.env["PORT"]),
      host: "0.0.0.0",
    }
  },
});