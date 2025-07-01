import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();
console.log("eslint cwd", process.cwd());

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
