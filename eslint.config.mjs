// @ts-check
import eslint from "@eslint/js"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs", "dist/"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    rules: {
      // Google style base rules
      "max-len": ["error", { code: 120, tabWidth: 2 }],
      "no-tabs": "error",
      indent: ["error", 2, { ignoredNodes: ["PropertyDefinition[decorators]"], switchCase: 2 }],
      "no-mixed-spaces-and-tabs": "error",
      "no-trailing-spaces": "error",
      "linebreak-style": ["error", "unix"],
      "no-multiple-empty-lines": ["error", { max: 2 }],

      // Custom rules
      "new-cap": "off",
      "comma-dangle": ["error", "never"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: ["error", "never"],
      "@typescript-eslint/explicit-member-accessibility": "off",
      "object-curly-spacing": "off",
      camelcase: "off",
      // "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "operator-linebreak": "off",
      "valid-jsdoc": "off",
      "require-jsdoc": "off",
      "quote-props": "off",
      "react/no-unescaped-entities": "off",
      // "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unused-vars": "off",

      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",

      //Prettier 
      "prettier/prettier": [
        "error",
        {
          semi: false,
          singleQuote: false,
          trailingComma: "none",
          arrowParens: "always",
          printWidth: 100,
          bracketSameLine: false
        }
      ]
    }
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', 'test/**/*.ts', 'e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  }
)