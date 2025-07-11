import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import preserveDirectives from "rollup-plugin-preserve-directives";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    dts({ tsconfigPath: "./tsconfig.build.json" }),
    preserveDirectives({ include: ["lib/**/*.{ts,tsx}"] }),
  ],
  build: {
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "next/link"],
      input: {
        styles: path.resolve(__dirname, "lib/styles.css"),
        index: path.resolve(__dirname, "lib/index.ts"),
        "next/index": path.resolve(__dirname, "lib/next/index.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        preserveModulesRoot: "lib",
        preserveModules: true,
      },
    },
  },
});
