import tseslint from "typescript-eslint";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReactHooks.configs["recommended-latest"],
  {
    settings: { react: { version: "detect" } },
    languageOptions: {
      ...pluginReact.configs.languageOptions,
      globals: globals.browser,
    },
    rules: {
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
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
