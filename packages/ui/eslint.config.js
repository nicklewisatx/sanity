import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: [
      "storybook-static/**",
      "**/storybook-static/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "node_modules/**",
      "**/*.min.js",
      "**/*.bundle.js",
      "**/vendor/**"
    ]
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Buffer: "readonly"
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }]
    }
  }
]
