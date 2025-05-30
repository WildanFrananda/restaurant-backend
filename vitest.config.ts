import { defineConfig } from "vitest/config"
import { resolve } from "path"
import swc from "unplugin-swc"

export default defineConfig({
  plugins: [swc.vite({ module: { type: "commonjs" } })],
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup/vitest.setup.ts"],
    include: ["test/e2e/**/*.e2e-spec.ts", "test/integration/**/*.spec.ts"],
    testTimeout: 30000,
    alias: {
      "@": resolve(__dirname, "src"),
      src: resolve(__dirname, "src")
    }
  }
})
