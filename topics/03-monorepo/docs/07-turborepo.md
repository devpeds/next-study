# Turborepo 도입

기존 모노레포 환경에 Turborepo를 도입한 과정에 대한 문서다.

## Turborepo

Turborepo는 JS/TS 환경에서 사용하는 빌드 시스템으로, 주로 모노레포 환경에서 프로젝트를 효율적이고 간편하게 운영할 수 있게 도와주는 개발도구다.

### Features

#### 의존성 기반 Task & 병렬 처리

Turborepo는 `turbo.json`의 `tasks` 필드에 작업(Task)을 정의하면, 각 패키지의 `package.json`에 해당 작업명이 존재할 경우 그 작업을 실행한다. 이때 작업은 가능한 한 병렬로 실행되며, 패키지 간 의존성 관계를 고려해 실행 순서를 자동으로 조정한다.

예를 들어 `web` 패키지가 `ui` 패키지에 의존하고 있고, 둘 다 `build` 스크립트를 가지고 있다면 `ui`의 `build`가 먼저 실행된 후 `web`의 `build`가 실행된다.

참고로, `pnpm --recursive` 명령어도 병렬 실행이 가능하지만, Turborepo처럼 의존성 기반 실행 순서 조정은 지원하지 않는다.

#### Task 단위 캐시 & 원격 캐시(Remote Cache)

Turborepo는 각 작업 단위로 결과를 캐싱하여, 이전과 동일한 입력에 대해서는 작업을 생략하고 캐시된 결과를 재사용한다. 이때 입력은 `turbo.json`에서 각 작업마다 `inputs` 필드를 통해 제어할 수 있으며, 따로 정의하지 않았다면 `.gitignore`에 정의된 파일을 제외한 모든 파일들이 입력으로 사용한다.

또한 Turborepo는 Vercel을 통해 원격으로 캐시를 저장할 수 있어, 팀 단위 개발 환경에서도 원격 캐시를 통해 빌드/테스트 시간을 대폭 줄일 수 있다.

## Integration

우선, 레포지토리 루트 디렉토리에 Turborepo를 설치한다.

```bash
pnpm add turbo -Dw
```

설치 후 `turbo.json`을 추가하고 사용할 작업들을 정의한다.

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "dev": {
      "dependsOn": ["^build"],
      "persistent": true,
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT", ".env.local"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "start": {
      "dependsOn": ["build"],
      "persistent": true,
      "cache": false
    },
    "lint": {},
    "format": {}
  }
}
```

주요 설정에 대해 설명하자면,

- `ui`

  작업을 실행할 때 터미널에서 로그를 보여주는 UI에 대한 설정으로, `tui`, `stream` 중 하나를 선택할 수 있다.

  `tui`는 패키지에서 서버를 띄우거나 프롬프트를 입력하는 등 인터렉션이 필요한 경우 사용하는게 좋으며, `stream`은 인터렉션 없이 단순 로그 출력할 경우 사용하는게 좋다.

  해당 프로젝트의 경우 개발 서버 혹은 빌드된 앱을 서버로 띄우는 경우가 있기 때문에 `tui`로 설정했다.

- `tasks.dev`

  Next.js 앱이나 컴포넌트 라이브러리의 개발 서버를 띄우는 `dev` 작업을 추가한다.

  앱에서 컴포넌트 라이브러리를 사용하기 전 라이브러리의 빌드가 선행되어야 하므로, 의존성의 빌드가 먼저 실행되어야 한다는 의미의 `dependsOn: ["^build"]`를 추가한다.

  또한 종료할 때까지 개발 서버가 살아있는 **long-running task**이므로, `persistent`는 `true`, `cache`는 `false`로 설정한다.

- `tasks.build`

  패키지를 빌드하는 `build` 작업을 추가한다. `dev`와 마찬가지로 앱을 빌드하기 전에 라이브러리가 빌드되도록 `dependsOn: ["^build"]`를 추가한다.

  그리고 환경변수가 바뀌면 빌드 결과도 변경되어야 하므로, 환경변수를 관리하는 `.env.local` 파일을 `inputs`에 추가한다.

  마지막으로 빌드 결과를 캐싱할 수 있도록 `outputs`를 설정한다. Next.js 앱의 경우 `.next`, 컴포넌트 라이브러리는 `dist` 폴더에 빌드되므로, 두 경로 모두 `outputs`에 추가한다.

- `tasks.start`

  빌드된 결과를 서버로 띄우는 `start` 작업을 추가한다. 빌드가 선행되어야 하므로, 동일 패키지의 작업이 먼저 실행되어야 한다는 의미의 `dependsOn: ["build"]`를 추가한다.

  또한 서버를 띄우는 작업이므로, `persistent`, `cache`를 `dev`와 동일하게 설정한다.

설정이 끝나면, `pnpm turbo lint`처럼 모든 패키지에 대한 작업을 실행하거나, `pnpm turbo @topic/03-monorepo#dev` 처럼 개별 패키지에 대한 작업을 실행할 수 있다.

## Custom Generator

Turborepo에서는 [Plop](https://plopjs.com)이란 코드 제너레이터를 사용해 커스텀 코드 제너레이터를 만들 수 있다. 이 기능을 이용해 기존 `@shared/create-topic`에서 제공하던 앱 생성 기능을 대체했다.

> **Plop**
>
> Plop은 간단한 코드 제너레이터 프레임워크로, 입력 받을때 사용할 프롬프트와 입력 이후 실행할 액션을 정의해 코드 제너레이터를 만들 수 있다.

### Migration

우선, `pnpm turbo gen` 을 실행해 custom generator 샘플을 생성한다.

생성 이후 `turbo/generators/config.ts` 파일을 열어 기존 `@shared/create-topic`과 동일하게 동작하도록 `generator()` 함수를 수정한다. 참고로 `generator()` 함수는 동기 함수로 작성해야 하며, 비동기로 작성할 경우 Turborepo에서 코드 제너레이터를 인식하지 못한다.

```ts
// turbo/generator/config.ts - (간소화 버전)
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // 템플릿에서 사용할 헬퍼 함수 추가
  const rootPath = plop.getDestBasePath();
  const topicNumber = getTopicNumber(path.resolve(rootPath, "topics"));
  plop.setHelper("topicNumber", () => topicNumber);

  // 코드 제너레이터 추가
  plop.setGenerator("topic", {
    description: "CLI에 노출할 코드 제너레이터 설명",
    prompts: [
      // 입력에 사용할 프롬프트 추가
      {
        type: "input",
        name: "name",
        message: "What is the name of the topic?",
        validate: (input: string) => {
          if (!input) {
            return "Topic name is required";
          }

          return true;
        },
      },
    ],
    actions: [
      // 입력 이후 실행할 액션 추가
    ],
  });
}
```

- Handlebars 파일에서 사용할 헬퍼 함수를 등록한다. 위 코드에는 토픽명 앞에 추가할 토픽 넘버를 반환하는 헬퍼 함수를 추가했다. 실제 코드에서는 주요 기술 스택의 시멘틱 버전과 메이저 버전을 반환하는 헬퍼 함수를 같이 추가했다.
- `plop.setGenerator`로 코드 제너레이터를 등록한다. 첫번째 인자는 코드 제너레이터의 이름으로 `pnpm turbo gen topic`을 실행하면 등록한 코드 제너레이터(`topic`)를 사용할 수 있다.
- 입력에 사용할 프롬프트를 추가한다. 경로, 패키지명, `README.md`, 소스 코드 등에 사용할 `name`을 프롬프트에 추가한다.
- 입력 이후 실행할 액션을 추가한다. 추가할 액션은 다음과 같다.
  - `README.md`, `package.json`, 소스 코드 등 패키지에 필요한 기본 파일들을 추가한다. 이 때 Plop에서 기본으로 제공하는 액션 중 `addMany` 액션을 추가한다.

    ```ts
    {
      type: "addMany", // 액션 타입
      destination: "{{ turbo.paths.root }}/topics/{{ topicNumber }}-{{ name }}", // 추가할 경로
      templateFiles: "templates/**/*", // destination에 추가할 파일들
    };
    ```

  - 추가한 패키지의 경로에서 `pnpm install`을 실행한다. Plop에서 제공하는 액션이 없으므로 커스텀 액션을 추가했다.

    ```ts
    async (data) => {
      const topicPath = `${topicNumber}-${data["name"]}`;
      const cwd = path.resolve(rootPath, `topics/${topicPath}`);
      return await spawnAsync("pnpm", { args: ["install"], cwd });
    };
    ```

  - 레포지토리 루트에 있는 `README.md`에 추가한 패키지를 `Topics` 섹션에 추가한다. `append`라는 액션을 제공하지만 아래에 소개할 이슈 때문에 커스텀 액션을 만들어 추가했다.

    ```ts
    async (data) => {
      const topicPath = `${topicNumber}-${data["name"]}`;
      await appendFile(
        path.resolve(rootPath, "README.md"),
        `- [${topicPath}](./topics/${topicPath})\n`,
      );
      return `${topicPath} is appended on /README.md`;
    };
    ```

> **Handlebars**
>
> Plop에서 사용하는 템플릿 언어로, `.hbs` 파일에서 작성하거나 액션 객체의 일부 필드 안에 인라인 형태로 작성할 수 있다.

작업이 끝나면, `pnpm turbo gen topic`을 실행해 새로운 앱을 생성할 수 있다. 또한 `package.json`에 스크립트를 추가하여 기존 `@shared/create-topic`과 동일한 명령어를 사용할 수도 있다.

```json
{
  "scripts": {
    "create-topic": "turbo gen topic"
  }
}
```

## Troubleshooting

### ESLint 설정 관련

Turborepo는 `turbo.json`의 `globalEnv`나 `tasks[task].env`에 명시되지 않은 환경 변수를 소스 코드에서 사용할 경우 에러를 발생시키는 `eslint-plugin-turbo`를 제공한다. 하지만 `.env` 파일에 있는 환경 변수 역시 `env` 필드에 선언하지 않으면 린트 에러가 발생해, `inputs`에 `.env` 파일을 추가함과 동시에 `env` 필드에 파일에 있는 모든 환경변수를 추가해야 하는 불편함이 발생했다.

현재 상황에서는 해당 플러그인을 사용하지 않아도 크게 문제가 될 것 같지 않지만, 만약 `.env` 파일 외부에서 정의된 환경 변수를 사용할 경우를 고려하면 린트로 이를 사전에 감지하는 것이 더 안전하다. 이 경우 `.env` 파일에서 관리하는 환경 변수들은 린트 대상에서 제외할 필요가 있었다. 이 경우 `.env`에 정의된 변수들은 린트 예외 처리 대상이 되어야 하며, 이를 위해 `turbo/no-undeclared-env-vars` 규칙에 있는 `allowList` 옵션을 활용해 `.env` 파일 내 변수들을 린트에서 제외할 수 있다.

```js
{
  rules: {
    'turbo/no-undeclared-env-vars': [
      'error',
      { allowList: ['^ENV_[A-Z]+$'] },
    ],
  },
}
```

### Plop에서 `append` 액션 사용시 특정 문자를 사용할 수 없는 문제

코드 제너레이터가 실행할 액션 중 레포지토리 루트에 있는 `README.md`에 생성한 패키지 경로를 `[패키지명](패키지 경로)` 형식으로 Topics 섹션에 추가하는 액션이 있었다. 하지만 [Plop 이슈](https://github.com/plopjs/plop/issues/462)로 인해 `append` 액션으로 `[`, `]` 같은 특정 문자가 포함된 문자열을 추가하려고 하면 `invalid regex` 에러가 발생해, 문자열 추가에 실패하는 문제가 있었다. `append` 액센을 사용해 문자열을 추가하려면 문제가 되는 문자 앞에 `\\`을 추가해야 하는데, `\\`을 추가할 경우 `\[03-monorepo\](./topics/03-monorepo)` 처럼 이스케이프 문자가 같이 출력이 되는 문제가 있었다. 관련 문제에 대해 좀 더 알아보고 싶었으나, 일단 `append` 액션 대신 위에서 설명한 커스텀 액션을 만들어 해결하였다.
