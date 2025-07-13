import eslintConfig from "@shared/eslint-config/react";
import { globalIgnores } from "eslint/config";
import reactRefresh from "eslint-plugin-react-refresh";

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
