import { defineConfig } from "vitest/config"
import { resolve } from "path"
import swc from "unplugin-swc"

import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: "es6" }
    }),
    tsconfigPaths()
  ],
  test: {
    globals: true,
    root: "./",
    environment: "node",
    setupFiles: ["./test/setup/vitest.setup.ts"],
    include: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json", "lcov"],
      exclude: ["src/**/*.module.ts", "src/**/*.interface.ts", "src/**/*.dto.ts", "src/main.ts"]
    },
    alias: {
      "@": resolve(__dirname, "./src"),
      src: resolve(__dirname, "./src")
    },
    testTimeout: 30000
  }
})
