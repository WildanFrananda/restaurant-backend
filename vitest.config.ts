import { defineConfig } from "vitest/config"
import swc from "unplugin-swc"

export default defineConfig(async () => {
  const tsconfigPaths = (await import("vite-tsconfig-paths")).default
  return {
    plugins: [
      swc.vite({
        module: { type: "es6" }
      }),
      tsconfigPaths()
    ],
    test: {
      globals: true,
      root: "./"
    }
  }
})
