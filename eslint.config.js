// eslint.config.js
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      ...eslint.configs.recommended.rules, // Use ESLint recommended rules
      ...tseslint.configs.recommended.rules, // Use TypeScript recommended rules

      // Custom Rules
      "semi": ["error", "always"], // 強制分號
      "quotes": ["error", "single", { "avoidEscape": true }], // 強制單引號，允許轉義
      // "indent": ["error", 2, { "SwitchCase": 1 }], // 強制縮排 2 空格
      "comma-dangle": ["error", "always-multiline"], // 強制尾隨逗號
      "object-curly-spacing": ["error", "always"], // 強制物件大括號內有空格
      "array-bracket-spacing": ["error", "never"], // 強制陣列中括號內無空格
      "arrow-parens": ["error", "always"], // 強制箭頭函式參數必須加括號
      "no-console": "warn", // 警告禁用 console
      "@typescript-eslint/no-unused-vars": "warn", // 警告未使用的變數
    }
  }
];
