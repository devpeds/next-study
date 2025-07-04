import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import eslintConfig from "@shared/eslint-config/react";

export default [
  globalIgnores(["dist"]),
  ...eslintConfig,
  reactRefresh.configs.vite,
];
