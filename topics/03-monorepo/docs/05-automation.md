# 자동화

`/topics` 디렉토리에 Next.js 앱을 추가하는 커맨드라인 툴을 개발한 과정에 대한 문서다.

## Design

`create-next-app`을 참고해 아래와 같이 설계했다.

1. `/topics` 디렉토리에 들어갈 프로젝트 이름과 함께 커맨드라인 툴을 실행한다. 프로젝트 이름이 입력되지 않으면 프롬프트를 통해 입력받는다.
2. 기존 `/topics` 디렉토리에 있는 프로젝트들 수를 기준으로, 몇 번째 주제인지를 나타내는 `topicNumber`를 추론해 프로젝트 이름 앞에 prefix로 추가하여 경로를 생성한다.
3. 생성된 경로에 `package.json`을 생성하고 필요한 의존성을 설치한다.
4. 프로젝트 명, `topicNumber`, 주요 기술 스택(NodeJs, React, Next.js)의 메이저 버전이 명시된 `README.md`를 생성한다.
5. 프로젝트 명을 앱 타이틀로 사용할 수 있도록 `.env.local` 파일을 생성한다.
6. `/template` 디렉토리에 관리하는 `eslint.config.mjs`, `tsconfig.json`와 같은 설정 파일, 소스 코드 등을 프로젝트 디렉토리에 복사한다.

## Integration

1. `@shared/create-topic`의 `package.json`에 커맨드라인 툴을 동작할 수 있도록 `bin` 필드를 추가한다.
   ```json
   {
     "name": "@shared/create-topic",
     "bin": "./dist/index.js"
     // ...other configurations
   }
   ```
2. 루트 디렉토리에 `@shared/create-topic`을 추가한다.
   ```bash
   pnpm add @shared/create-topic --workspace -D
   ```
3. 커맨드라인 툴을 실행해 프로젝트를 생성한다.
   ```bash
   pnpm create-topic monorepo
   ```

## Troubleshooting

### 실행 위치에 따른 경로 해석

초기 구현에서는 현재 작업 디렉토리를 기준으로 `/topics` 디렉토리를 찾도록 했다.

```ts
const topicsDirectory = path.resolve(process.cwd(), "topics");
```

이 구현은 루트 디렉토리에서 실행할 때는 정상적으로 동작했지만, `topics/01-next-auth`, `packages/ui` 등 내부 패키지에서 실행하면 현재 작업 경로가 루트에서 해당 내부 경로로 변경되어 `/topics` 디렉토리를 찾지 못하는 문제가 발생했다.

이를 해결하기 위해 현재 작업 경로 대신 **현재 모듈의 경로**를 기준으로 `/topics` 디렉토리를 찾도록 수정했다.

```ts
// at create-topic/index.ts
const topicsDirectory = path.resolve(import.meta.dirname, "../../../topics");
```

이때 경로의 기준은 `create-topic/index.ts`가 아니라, `package.json`의 `bin` 필드에 명시된 `create-topic/dist/index.js`이다.

### 종속성 설치

초기 구현에서는 생성된 프로젝트 경로에서 `pnpm add` 명령어를 통해 모든 의존성을 설치했다.

```ts
function addDependencies(
  projectDir: string,
  dependencies: string[],
  options?: { dev?: boolean; workspace?: boolean }
) {
  const args = [
    "add",
    ...dependencies,
    options?.dev && "-D",
    options?.workspace && "--workspace",
  ];

  spawn("pnpm", args, { cwd: projectDir });
}

addDependencies(projectDir, ["react", "react-dom", "next"]);
addDependencies(projectDir, ["@shared/ui"], { workspace: true });
addDependencies(projectDir, ["eslint", "typescript"], { dev: true });
addDependencies(projectDir, ["@shared/eslint-config", "@shared/ts-config"], {
  dev: true,
  workspace: true,
});
```

하지만 `spawn`은 자식 프로세스에서 명령어를 실행하기 때문에, 4개의 프로세스 중 설치가 가장 늦게 종료된 프로세스에서 `package.json`을 덮어써 버리는 문제가 있었다. 이를 해결하기 위해 `Promise`를 활용해 비동기 함수를 만들어 이전 명령어가 종료된 이후에 커맨드를 실행할 수 있도록 수정했다.

```ts
async function addDependencies(
  projectDir: string,
  dependencies: string[],
  options?: { dev?: boolean; workspace?: boolean }
) {
  const args = [
    "add",
    ...dependencies,
    options?.dev && "-D",
    options?.workspace && "--workspace",
  ];

  return new Promise<void>((resolve, reject) => {
    spawn("pnpm", args, { cwd: projectDir }).on("close", (code) => {
      if (code !== 0) {
        return reject("failed to execute the command.");
      }

      resolve();
    });
  });
}

await addDependencies(/** ... */);
await addDependencies(/** ... */);
```

비동기 함수로 수정한 이후에는 의도대로 동작했지만, 다음과 같은 문제점이 있었다.

1. 설치 옵션(-D, --workspace)이 종속성마다 달라 커맨드를 네 번에 나눠 순차 실행해야 하므로 설치 시간이 오래 걸린다.
2. 명령어 실행 시점에 따라 외부 패키지의 설치 버전이 달라질 수 있다. 이는 의도된 동작이지만, 각 프로젝트의 패키지 버전이 달라지면서 전체 레포지토리 용량이 불필요하게 증가할 수 있다.

이를 해결하기 위해 `package.json`을 생성 시 필요한 패키지들을 `dependencies`와 `devDependencies`에 명시하고, `pnpm add` 명령어 대신 `pnpm install` 명령어를 실행하는 방식으로 수정했다.

```ts
import fs from "fs/promises";
import path from "path";

async function createPackageJson(projectDir: string, topicName: string) {
  const packageJson = {
    name: `@topic/${topicName}`,
    dependencies: {
      "@shared/ui": "workspace:*",
      next: "^15.3.5",
      react: "^19.1.0",
      "react-dom": "^19.1.0",
    },
    // ...other configurations
  };

  // JSON.stringify 끝에 개행을 추가해야 JSON이 정상적으로 개행됨.
  // 끝에 개행이 없으면 한 줄로 JSON이 표기됨.
  await fs.write(
    path.resolve(projectDir, "package.json"),
    JSON.stringify(packageJson, null, 2) + "\n"
  );
}
```

종속성 설치 방식을 변경한 이후, 20~30초 걸리던 설치 시간이 수 초로 줄어들었으며, 이후 단계에서 `package.json` 파일을 다시 쓰지 않기 때문에 종속성 설치와 다른 작업들을 병렬로 실행할 수 있게 되었다.
