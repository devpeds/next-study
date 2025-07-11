import eslintConfig from "@shared/eslint-config/base";
import { globalIgnores } from "eslint/config";

/** @type {import("eslint").Linter.Config[]} */
export default [globalIgnores(["dist"]), ...eslintConfig];
