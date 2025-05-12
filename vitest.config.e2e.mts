// vitest.config.e2e.ts
import { defineConfig } from "vitest/config"
import swc from "unplugin-swc"
import { resolve } from "path"

export default defineConfig({
  plugins: [swc.vite({ module: { type: "commonjs" } })],
  test: {
    include: ["test/e2e/**/*.e2e-spec.mts"],
    globals: true,
    environment: "node",
    // setupFiles: ["./test/setup/vitest.setup.ts"],
    testTimeout: 30000,
    alias: {
      "@": resolve(__dirname, "src"),
      test: resolve(__dirname, "test")
    }
  }
})
