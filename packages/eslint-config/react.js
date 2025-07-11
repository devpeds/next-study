import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import baseConfig from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
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
    },
  },
];
