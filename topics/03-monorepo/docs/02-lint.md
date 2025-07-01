# 린트 설정 공유

모노레포 환경에서 프로젝트마다 동일한 lint rule을 적용한 과정에 대한 문서다.

## Steps

1. `packages` 디렉토리를 만들고 workspace에 추가한다.

   ```yaml
   # pnpm-workspace.yaml
   packages:
     - topics/*
     - packages/*
   ```

2. `packages` 디렉토리에 `eslint-config` 디렉토리를 추가하고, `package.json`을 추가한다.

   ```bash
   # at root directory
   mkdir packages/eslint-config
   cd packages/eslint-config
   pnpm init
   ```

3. `packages/eslint-config`에 필요한 패키지를 디펜던시에 추가한다. 터보레포나 여타 다른 모노레포 템플릿의 경우 `devDependencies`를 사용하나, 패키지 자체로만 보면 패키지가 설치될 때 같이 설치되는게 맞다고 판단해 `dependencies`에 필요 패키지들을 추가했다.

   ```bash
   # at packages/eslint-config
   pnpm add @eslint/eslintrc eslint-config-next
   ```

   `@eslint/eslintrc`는 기존 lint 설정을 관리하던 `.eslintrc`파일을 ESLint8부터 도입된 **Flat config** 체계에 호환되도록 도와주는 유틸리티 라이브러리다.

   `eslint-config-next`는 Next.js에서 제공하는 설정 파일로, **[flat config가 아닌 `.eslintrc` 형식으로 설정 되어있기 때문에](https://witch.work/ko/posts/blog-eslint-pnpm-bugfix#eslint-config-next-%ED%8C%A8%ED%82%A4%EC%A7%80-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0)** `@eslint/eslintrc`가 필요하다.

4. Next.js용 린트 설정 파일인 `next.js`를 아래와 같이 추가한다.

   ```js
   // packages/eslint-config/next.js
   import { dirname } from "path";
   import { fileURLToPath } from "url";
   import { FlatCompat } from "@eslint/eslintrc";

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   const compat = new FlatCompat({ baseDirectory: __dirname });

   /** @type {import("eslint").Linter.Config[]} */
   export default [
     ...compat.extends("next/core-web-vitals", "next/typescript"),
     // ...other configs
   ];
   ```

   `FlatCompat`의 `extends()`함수가 `packages/eslint-config`에서부터 인자로 들어간 설정 파일을 찾을 수 있도록, `import.meta.url`을 사용해 기본 경로(`baseDirectory`)을 설정한다. 기본경로를 설정하지 않으면 현재 작업 경로가 기본 작업 경로로 설정되어, 린트가 실행되는 프로젝트 디렉토리에서부터 설정 파일을 찾기 시작한다.

   `FlatCompat`에 기본 경로(`baseDirectory`)를 설정하지 않으면 현재 작업 경로(`cwd`)로 설정되어, 린트를 실행하는 경로에서 `extends()` 함수 인자로 들어간 설정 파일을 찾기 시작한다. 예를 들어 `topics/01-next-auth` 디렉토리에서 `pnpm lint`를 실행하면, ESLint는 `topics/01-next-auth`와 그 부모 디렉토리에서 설정 파일을 찾는다. 각 프로젝트에 있던 `eslint-config-next`는 삭제할 예정이므로 현재 작업 경로를 사용하면 설정 파일을 찾을 수 없어 린트에 실패한다.

5. `package.json`을 수정한다.

   ```json
   {
     "name": "@shared/eslint-config",
     "version": "1.0.0",
     "type": "module",
     "private": true,
     "exports": {
       "./next": "./next.js"
     },
     "peerDependencies": {
       "eslint": ">= 9"
     },
     "dependencies": {
       "@eslint/eslintrc": "^3.3.1",
       "eslint-config-next": "^15.3.4"
     }
   }
   ```

   - 프로젝트에서 사용할 내부 패키지들을 **scope package** 형태로 사용하기 위해 패키지명에 `@shared`를 prefix로 추가했다.
   - 모듈 시스템으로 ESM을 사용하므로 `type`에 `"module"`을 명시한다.
   - 사용처에서 `@shared/eslint-config/next`에서 Next.js용 설정 파일을 가져올 수 있도록 `exports` 필드를 추가한다.
   - `peerDependencies`에 해당 모듈과 같이 사용해야 하는 패키지들을 추가한다.

6. 프로젝트에 `@shared/eslint-config`을 적용한다.

   ```bash
   # at root directory
   pnpm remove eslint-config-next --filter "@topic/*"
   pnpm add @shared/eslint-config --filter "@topic/*" --workspace
   ```

   패키지 추가 후 설정 파일을 수정한다.

   ```js
   import eslintNext from "@shared/eslint-config/next";

   /** @type {import("eslint").Linter.Config[]} */
   const eslintConfig = [...eslintNext];

   export default eslintConfig;
   ```

## Troubleshooting

### VSCode가 Next.js의 린트 설정을 인식하지 못하는 문제

모노레포와 관계 없지만, pnpm 사용시 VSCode의 ESLint 플러그인이 Next.js의 린트 설정을 인식하지 못해 린터가 제대로 동작하지 않는 문제가 있었다. pnpm 관련된 문제라 생각하지 못해 한동안 헤매다가, pnpm v10부터 **eslint 및 prettier 관련 패키지들이 node_modules 최상위에 위치하도록 하는 설정**이 빠지면서 발생한 문제임을 알게 되었다. 이를 해결하기 위해 `.npmrc` 파일에 eslint, prettier 관련 패키지가 최상위에 위치하도록 설정을 추가했다. 원인과 해결 방법에 대한 자세한 내용은 [여기](https://witch.work/ko/posts/blog-eslint-pnpm-bugfix)를 참고한다.

```yaml
# .npmrc
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```

## References

- [ESLint - Share Configuration](https://eslint.org/docs/latest/extend/shareable-configs)
- [pnpm을 사용하는 Next.js 프로젝트에서 eslint-config-next가 죽는 이유와 해결법](https://witch.work/ko/posts/blog-eslint-pnpm-bugfix)
