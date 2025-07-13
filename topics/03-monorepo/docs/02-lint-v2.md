# 린트 설정 (V2)

공통 라이브러리, 커맨트라인 도구 개발 이후, 변경된 린트 설정에 관한 문서다. 기존 린트 설정에 관한 문서는 [02-lint.md](./02-lint.md)에서 확인 가능하다.

## Design

초기 구현과 달리 Next.js용 린트 설정과 별개로 리액트 라이브러리와 커맨드라인 도구용 설정 파일이 필요해졌다. 따라서 아래와 같이 3개의 파일을 만들어 사용하는 것으로 설계했다.

- `base.js`: 기본 설정 파일. 커맨드라인 도구처럼 특정 라이브러리/프레임워크에 종속되지 않는 프로젝트에서 사용한다.
- `react.js`: React 라이브러리용 설정 파일. `base.js`를 확장해 사용한다.
- `next.js`: 기존 Next.js용 설정 파일. `base.js`를 확장해 사용한다.

## Development

1. `base.js` 파일을 추가한다. 가장 기본이 되는 파일이므로 `@eslint/js`, `typescript-eslint` 등 프로젝트 성격과 상관없이 공통으로 적용할 규칙을 추가한다.

   ```js
   import js from "@eslint/js";
   import tseslint from "typescript-eslint";

   /** @type {import("eslint").Linter.Config[]} */
   export default [
     js.configs.recommended,
     ...tseslint.configs.recommended,
     // ...other rules
   ];
   ```

2. `react.js` 파일을 추가한다. `base.js`의 설정에 React 관련 플러그인을 추가한다.

   ```js
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
   ```

3. `next.js` 파일을 수정한다. 레거시 설정을 위해 도입한 `FlatCompat` 대신, [Turborepo의 샘플](https://github.com/vercel/turborepo/blob/main/examples/basic/packages/eslint-config/next.js)을 참고해 Flat Config 방식으로 재작성한다.

4. 추가한 파일을 사용할 수 있도록 `package.json`을 수정한다.

   ```json
   {
     "name": "@shared/eslint-config",
     "exports": {
       "./base": "./base.js",
       "./react": "./react.js",
       "./next": "./next.js"
     }
   }
   ```

## Troubleshooting

### 플러그인 충돌 문제

처음 `next.js` 파일을 수정할 때 기존 .eslintrc 방식에 `base.js`을 추가하는 방향으로 구성했다.

```js
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import baseConfig from "./base.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...baseConfig,
];
```

하지만 실제 ESLint를 실행하면 플러그인을 중복 정의 에러가 발생해, [Flat Config 방식](../../../packages/eslint-config/next.js)으로 재작성했다.

코드를 재작성하면서 [VSCode가 Next.js의 린트 설정을 인식하지 못하는 문제](./02-lint.md#vscode가-nextjs의-린트-설정을-인식하지-못하는-문제)도 함께 해결되어, `.npmrc` 파일을 삭제했다.
