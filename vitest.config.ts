import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // match tsconfig.json paths
    },
  },
  test: {
    globals: true,               // so you can use `describe/it/expect` without imports
    environment: "happy-dom",    // light DOM implementation for React components
    setupFiles: "./vitest.setup.ts",
    include: ["src/__tests__/**/*.test.{ts,tsx}"],
  },
});