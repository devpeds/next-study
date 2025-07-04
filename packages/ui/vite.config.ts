import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import copy from "rollup-plugin-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    dts({ include: ["lib"], tsconfigPath: "./tsconfig.build.json" }),
    copy({
      targets: [{ src: "lib/globals.css", dest: "dist" }],
      hook: "writeBundle",
    }),
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: {
        styles: path.resolve(__dirname, "lib/styles.css"),
        ...Object.fromEntries(
          // https://rollupjs.org/configuration-options/#input
          glob
            .sync("lib/**/*.{ts,tsx}", {
              ignore: ["lib/**/*.d.ts", "lib/types.ts"],
            })
            .map((file) => [
              // 1. The name of the entry point
              // lib/nested/foo.js becomes nested/foo
              path.relative(
                "lib",
                file.slice(0, file.length - path.extname(file).length)
              ),
              // 2. The absolute path to the entry file
              // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
              fileURLToPath(new URL(file, import.meta.url)),
            ])
        ),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
