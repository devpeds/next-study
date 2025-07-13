# Prettier 설정

모노레포 환경에서 prettier를 적용한 과정에 대한 문서다.

## Steps

1. 루트 디렉토리에 Prettier를 추가한다.

   ```bash
   pnpm add prettier -D --workspace
   ```

2. `prettier.config.js` 파일에 사용할 옵션을 설정한다.

   ```js
   /**
    * @see https://prettier.io/docs/en/configuration.html
    * @type {import("prettier").Config}
    */
   const config = {
     trailingComma: "all",
     tabWidth: 2,
     singleQuote: false,
     semi: true,
     printWidth: 80,
     // ...other options
   };

   export default config;
   ```

3. `pnpm-lock.yaml`, `node_modules` 등 포맷팅에 제외할 파일/경로를 `.prettierignore` 파일에 추가한다.

4. 코드 포맷팅을 병렬로 실행하기 위해 각 패키지의 `package.json`에 스크립트를 추가한다.

   ```json
   {
     "scripts": {
       "format": "prettier . --write"
     }
   }
   ```

5. 루트 디렉토리에서 포맷팅을 실행한다.

   ```bash
   pnpm -r format
   ```

## .git-blame-ignore-revs

기존 프로젝트에 포매터를 도입하거나 새로운 포매팅 옵션을 적용하면, 대량의 코드 변경이 발생해 이후 `git blame`으로 코드 이력을 추적하기 어려워질 수 있다. 이러한 문제를 해결하기 위해 Git은 특정 커밋을 blame 결과에서 제외할 수 있는 기능을 제공한다.

이를 간단하게 적용하려면, 프로젝트 루트에 `.git-blame-ignore-revs` 파일을 생성하고, 포매팅이 적용된 커밋의 해시를 해당 파일에 추가하면 된다. 이때 추가할 커밋 해시의 기준은 프로젝트에서 커밋을 병합하는 방식에 따라 달라진다.

- Merge: 포맷팅이 적용된 원본 커밋 해시를 추가한다.
- Rebase: rebase 이후 커밋 해시가 변경되므로, 변경된 커밋 해시를 추가한다.
