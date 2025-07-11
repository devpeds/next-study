import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import eslintConfig from "@shared/eslint-config/react";

/** @type {import("eslint").Linter.Config[]} */
export default [
  globalIgnores(["dist"]),
  ...eslintConfig,
  reactRefresh.configs.vite,
  {
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];
