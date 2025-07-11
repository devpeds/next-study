# 공통 라이브러리 추가

모노레포 환경에서 Next.js에 공통 UI 컴포넌트 라이브러리를 적용한 과정에 대한 문서다.

## Steps

1. 필자에게 익숙한 빌드 툴인 Vite를 사용해 라이브러리를 만들 예정이므로, `packages` 디렉토리에서 `create-vite`를 실행해 `ui` 디렉토리에 리액트 프로젝트를 생성한다.

   ```bash
   # at root directory
   cd packages
   pnpm create vite ui --template react-ts
   ```

2. 리액트 라이브러리용 설정을 `@shared/eslint`와 `@shared/ts-config`에 각각 추가한다.

   <details>
     <summary>@shared/eslint</summary>

   ```js
   // @shared/ui/eslint-config/react.js
   import tseslint from "typescript-eslint";
   import js from "@eslint/js";
   import pluginReact from "eslint-plugin-react";
   import pluginReactHooks from "eslint-plugin-react-hooks";
   import globals from "globals";

   /\** @type {import("eslint").Linter.Config[]} */;
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
   ```

   </details>

   <details>
      <summary>@shared/ts-config</summary>

   ```json
   // @shared/ts-config/react-lib.json
   {
     "$schema": "https://json.schemastore.org/tsconfig",
     "extends": "./base.json",
     "compilerOptions": {
       "module": "esnext",
       "moduleResolution": "bundler",
       "jsx": "react-jsx"
     }
   }
   ```

   </details>

3. `@shared/eslint-config`, `@shared/ts-config` 등 컴포넌트 라이브러리에 개발에 필요한 패키지들을 devDependencies에 추가한다. `react`와 `react-dom` 역시 dependencies 대신 devDependencies에 추가한다.

   ```json
   // package.json
   {
     // ...other configuration
     "dependencies": {
       // 설치시 같이 추가될 패키지 명시
     },
     "devDependencies": {
       "@shared/eslint-config": "workspace:*",
       "@shared/ts-config": "workspace:*",
       "@tailwindcss/vite": "^4.1.11",
       "@types/react": "^19.1.8",
       "@types/react-dom": "^19.1.6",
       "@vitejs/plugin-react": "^4.5.2",
       "eslint": "^9.29.0",
       "eslint-plugin-react-refresh": "^0.4.20",
       "glob": "^11.0.3",
       "next": "^15.3.5",
       "react": "^19.1.0",
       "react-dom": "^19.1.0",
       "tailwindcss": "^4.1.11",
       "typescript": "~5.8.3",
       "vite": "^7.0.0",
       "vite-plugin-dts": "^4.5.4",
       "vite-tsconfig-paths": "^5.1.4"
     }
   }
   ```

4. 공통 eslint, 타입스크립트 설정을 적용한다.

    <details>
      <summary>eslint.config.js</summary>

   ```js
   import reactRefresh from "eslint-plugin-react-refresh";
   import { globalIgnores } from "eslint/config";
   import eslintConfig from "@shared/eslint-config/react";

   export default [
     globalIgnores(["dist"]),
     ...eslintConfig,
     reactRefresh.configs.vite,
   ];
   ```

    </details>

    <details>
      <summary>tsconfig.json (tsconfig.app.json)</summary>

   ```json
   {
     "extends": "@shared/ts-config/react-lib.json",
     "compilerOptions": {
       // ...overriding "react-lib" configuration
     },
     "include": ["src", "lib"]
   }
   ```

    </details>

5. `src` 디렉토리는 예제 어플리케이션 코드를 추가할 예정이므로, `lib` 디렉토리를 추가한다. `lib` 디렉토리 구조는 아래와 같이 설계한다.

   - `index.ts`: 라이브러리의 엔트리 파일. `next` 디렉토리를 제외하고 사용처에 제공할 컴포넌트 및 유틸 모두 여기서 export 한다.
   - `styles.css`: tailwindcss 설정이 포함된 스타일시트 파일.
   - `components/`: 컴포넌트 파일들로 구성된 디렉토리. 사용처에 제공할 컴포넌트를 관리한다.
   - `next/`: Next.js 전용 컴포넌트 패키지. 사용처에 제공할 컴포넌트를 `next/index.ts`에서 export 한다.

6. 빌드시 `dist` 디렉토리에 라이브러리가 빌드 되도록 `vite.config.ts`를 아래와 같이 수정한다.

   ```ts
   // vite.config.ts
   import tailwindcss from "@tailwindcss/vite";
   import react from "@vitejs/plugin-react";
   import path from "path";
   import { defineConfig } from "vite";
   import dts from "vite-plugin-dts";
   import tsconfigPaths from "vite-tsconfig-paths";

   // https://vite.dev/config/
   export default defineConfig({
     plugins: [
       tsconfigPaths(),
       react(),
       tailwindcss(),
       dts({ tsconfigPath: "./tsconfig.build.json" }),
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
   ```

   - `plugins`에 아래 플러그인을 추가한다.
     - `vite-tsconfig-paths`: `tsconfig.app.json`에 설정한 path alias를 vite가 인식할 수 있게 하는 플러그인
     - `@vitejs/react-plugin`: (예제 앱 전용) Vite에서 제공하는 리액트용 플러그인으로, fast refresh 등을 지원한다.
     - `@tailwindcss/vite`: Vite용 TailwindCSS 플러그인으로, 개발 환경에 TailwindCSS를 적용하거나 빌드시 CSS 파일을 빌드할 때 사용한다.
     - `vite-plugin-dts`: 빌드시 타입 선언 파일을 만들 때 사용하는 플러그인으로, 빌드 전용 타입스크립트 설정 파일 [`tsconfig.build.json`](../../../packages/ui/tsconfig.build.json)을 만들어 `tsconfigPath`에 해당 파일의 상대 경로를 추가한다.
   - Vite 라이브러리 모드를 사용하기 위해 `build` 옵션을 추가한다.
     - `copyPublicDir`: `public/` 디렉토리 내 파일을 라이브러리에서 사용하지 않으므로 `false`로 설정한다.
     - `cssCodeSplit`: css 파일이 포함되어야 하므로 `true`로 설정한다.
     - `lib`: 라이브러리 모드를 사용하기 위한 옵션. 라이브러리의 엔트리 파일의 경로 `entry`와 번들 포맷 `format`을 설정한다.
   - 번들링 커스터마이징을 위해 `build.rollupOptions`을 추가한다.
     - `external`: 리액트와 Next.js 코드가 번들링에 포함하지 않도록 `["react", "react/jsx-runtime", "next/link"]`를 추가한다.
     - `input`: 다중 엔트리 파일을 등록하고 싶을 때 사용하는 옵션이다. `index.ts`, `next/index.ts`, `styles.css`를 엔트리 파일로 사용할 예정이므로, 해당 파일들은 `input`에 추가한다.
     - `output`: 번들링 시 `input`의 키 값을 엔트리 파일명으로 사용할 수 있도록 `entryFileNames` 옵션을 설정한다. 그리고 파일마다 개별적으로 번들링 되도록 `preserveModules`를 `true`, `preserveModulesRoot`는 라이브러리 디렉토리로 지정한다. 반대로 `preserveModules`를 `false`로 설정하면, 파일들은 연결된 엔트리 파일 기준으로 하나로 합쳐진다.

7. `package.json`을 수정한다.

   ```json
   {
     "name": "@shared/ui",
     "type": "module",
     "exports": {
       ".": "./dist/index.js",
       "./next": "./dist/next/index.js",
       "./styles.css": "./dist/styles.css"
     },
     "scripts": {
       // ... other scripts
       "build": "tsc --p tsconfig.build.json && vite build"
     },
     "peerDependencies": {
       "next": ">=15",
       "react": "^19",
       "react-dom": "^19",
       "tailwindcss": "^4"
     },
     "peerDependenciesMeta": {
       "next": {
         "optional": true
       }
     }
   }
   ```

   - 패키지명을 네이밍 룰에 따라 `@shared/ui`로 변경한다.
   - `exports`를 아래와 같이 추가한다.
     - `@shared/ui`에서 공통 컴포넌트를 가져올 수 있도록 `".": "./dist/index.js"`를 추가한다.
     - `@shared/ui/next`에서 Next.js 전용 컴포넌트를 가져올 수 있도록 `"./next": "./dist/next/index.js"`를 추가한다.
     - `@shared/ui/styles.css`를 사용할 수 있도록 `"./styles.css": "./dist/styles.css"`를 추가한다.
   - 라이브러리 빌드를 위해 `build` 스크립트를 추가한다.
   - 사용처에서 컴포넌트 라이브러리와 같이 사용해야 할 패키지를 `peerDependencies`에 추가한다. Next.js의 경우 전용 컴포넌트를 사용하지 않는다면 같이 사용하지 않아도 되므로, `peerDependenciesMeta`에 `"next": { "optional": true }`를 추가한다.

8. Next.js 프로젝트에 `@shared/ui` 패키지를 추가한다. 컴포넌트 라이브러리를 사용하려면 번들링이 선행되어야 한다.

   ```bash
   # at topics/02-next-auth-v5
   pnpm add @shared/ui --workspace
   ```

9. Next.js 프로젝트의 `src/app/globals.css`에 `@shared/ui/styles.css`를 임포트한다.

   ```css
   @import "tailwindcss";
   @import "@shared/ui/styles.css";

   /* ...other style configurations */
   ```

## Troubleshooting

### 빌드 시 `"use client"` 지시어가 삭제되는 현상

라이브러리에 있는 클라이언트 컴포넌트를 Next.js 프로젝트에서 사용시 `"use client"` 지시어가 누락되었다는 에러가 발생했다. 확인해보니, Vite가 번들링 과정에서 내부적으로 사용하는 [Rollup이 `"use client"` 지시어를 제거하기 때문에 발생하는 현상](https://github.com/rollup/rollup/issues/4699)이었다. 이를 해결하기 위해 `rollup-plugin-preserve-directives`을 `vite.config.ts`에 추가해 빌드된 컴포넌트 파일에 `"use client"` 지시어가 유지도되록 했다.

```ts
import { defineConfig } from "vite";
import preserveDirectives from "rollup-plugin-preserve-directives";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ...other plugins
    preserveDirectives({ include: ["lib/**/*.{ts,tsx}"] }),
  ],
  build: {
    // ...other build options
    rollupOptions: {
      // ...other rollup options
      output: {
        preserveModules: true,
      },
    },
  },
});
```

`rollup-plugin-preserve-directives`이 의도대로 동작하려면 `build.output.preserveModules`가 `true`로 설정해야 한다. 그리고 플러그인 적용 후 라이브러리 개발 환경에서 css 파일을 제대로 처리하지 못해 Vite에서 Internal server 에러가 발생하는데, 이를 해결하기 위해 라이브러리의 타입스크립트 파일에만 플러그인이 적용 되도록 `include` 옵션을 추가했다.

## References

- [Setting up Tailwind CSS v4 in Turbo Monorepo](https://medium.com/@philippbtrentmann/setting-up-tailwind-css-v4-in-a-turbo-monorepo-7688f3193039)
- [Create a Component Library Fast(using Vite's library mode)](https://dev.to/receter/how-to-create-a-react-component-library-using-vites-library-mode-4lma/)
