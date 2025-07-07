# 타입스크립트 설정

모노레포 환경에서 프로젝트마다 동일한 타입스크립트 환경을 적용한 과정에 대한 문서다.

## Steps

1. `packages` 디렉토리에 `ts-config` 디렉토리를 추가하고 `packages.json` 파일을 추가한다.

   ```bash
   # at root directory
   mkdir packages/ts-config
   cd packages/ts-config
   pnpm init
   ```

2. `package.json`에서 패키지명을 `@shared/ts-config`로 변경한다.

3. 공통 타입스크입트 설정 파일 `base.json` 파일을 추가한다.

   ```json
   {
     "$schema": "https://json.schemastore.org/tsconfig",
     "compilerOptions": {
       "target": "ES2017",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "declaration": true,
       "declarationMap": true,
       "emitDeclarationOnly": false,
       "noEmit": false,
       "esModuleInterop": false,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "incremental": true
     }
   }
   ```

   - `$schema`: IDE에서 자동완성, 타입 체크 등을 지원할 수 있도록 tsconfig 스키마를 추가한다.
   - `target`: 트랜스파일시 변환될 ECMAScript의 버전을 명시한다.
   - `lib`: 타입 검사에 사용될 **표준 라이브러리**의 타입 정의 파일을 명시한다.
   - `allowJS`: js 파일을 임포트할 수 있는지 여부를 명시한다.
   - `skipLibCheck`: 선언 파일(`d.ts`)의 타입 검사를 생략하는 대신, 앱 소스 코드에서 직접 참조하는 코드만 참조할지 여부를 명시한다.
   - `strict`: 엄격한 타입 검사 모드를 결정하는 옵션으로, 여러 하위 옵션들도 같이 활성화할 수 있다.

   | 옵션                           | 설명                                                    |
   | :----------------------------- | :------------------------------------------------------ |
   | `strictNullChecks`             | `null`, `undefined`를 별도의 타입 처리                  |
   | `noImplicitAny`                | 정의되지 않은 타입이 `any`로 추론되지 않도록 처리       |
   | `strictFunctionTypes`          | 함수 타입 간 호환성 검사 시 더 엄격한 규칙을 적용       |
   | `strictBindCallApply`          | .bind, .call, .apply 메서드의 인자 타입을 엄격하게 검사 |
   | `strictPropertyInitialization` | 클래스 프로퍼티가 생성자에서 초기화 되도록 강제         |
   | `noImplicitThis`               | `this`가 암묵적으로 `any`가 되지 않도록 처리            |
   | `alwaysStrict`                 | 컴파일된 JS 파일에 `"use strict"` 추가                  |

   - `declaration`: 타입 선언 파일 생성 여부를 명시한다.
   - `declarationMap`: 소스맵 파일(`d.ts.map`) 생성 여부 . 소스맵 파일이 있으면 IDE에서 원본 ts 파일로 이동시킬 수 있다(ex. VSCode의 `Go to Definition` 기능).
   - `emitDeclarationOnly`: JS 파일 없이 타입 선언 파일만 생성할지 여부를 명시한다.
   - `noEmit`: 타입 선언, JS 소스 코드 등 출력 파일을 생성하지 않을지 여부를 명시한다. 바벨이나 SWC와 같이 트랜스파일러가 따로 있고, 타입스크립트는 타입 검사용으로만 사용할 때 `true`로 설정한다.
   - `esModuleInterop`: CommonJS 모듈을 ES 모듈처럼 다룰 수 있도록 트랜스파일시 헬퍼 함수 추가 여부를 명시한다. `true`로 설정하면 CommonJS 모듈과 ES 모듈간 충돌을 피하고 사용할 수 있으며, `importHelpers` 옵션을 켜고 `tslib` 라이브러리를 디펜던시에 추가하면 JS 코드의 크기를 줄일 수 있다. [[자세히](https://www.typescriptlang.org/ko/tsconfig/#esModuleInterop)]
   - `resolveJsonModule`: JSON 파일을 임포트할 수 있는지 여부를 명시한다.
   - `isolatedModules`: 하나의 프로젝트가 아닌 파일 단위로 컴파일을 실행할지 여부를 명시한다. `true`로 설정하면 파일 단위 컴파일(바벨, SWC 등) 실행시 발생할 수 있는 문제를 예방할 수 있도록 몇 가지 제약 사항이 추가된다. [[자세히](https://www.typescriptlang.org/ko/tsconfig/#isolatedModules)]
   - `incremental`: 증분 빌드 기능을 사용 여부를 명시한다. `true`로 설정하면 컴파일 출력물과 같은 디렉토리 혹은 `tsBuildInfoFile` 옵션에 설정한 디렉토리에 `.tsbuildinfo` 파일이 생성된다.

4. Next.js용 타입스크립트 설정 파일 `next.json` 파일을 추가한다.

   ```json
   {
     "$schema": "https://json.schemastore.org/tsconfig",
     "extends": "./base.json",
     "compilerOptions": {
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "jsx": "preserve",
       "plugins": [{ "name": "next" }]
     }
   }
   ```

   - `extends`: 공통 타입스크립트 설정을 적용하기 위해 `base.json`의 상대 경로를 추가한다.
   - `module`: 트랜스파일된 JS 코드에서 사용할 모듈 시스템을 ESM(`esnext`)으로 명시한다.
   - `moduleResolution`: 모듈 해석 전략으로 `bundler`를 사용한다. `bundler`를 사용하면 기존 Node.js의 CommonJS 해석 방식(`node_modules` 탐색, 확장자 생략 등)과 최신 ESM 해석 방식(`package.json`의 `imports/exports` 필드 지원) 모두 지원한다. [[자세히](https://www.typescriptlang.org/docs/handbook/modules/reference.html#bundler)]
   - `jsx`: 트랜스파일된 JS 코드에 JSX 문법이 유지되도록 `preserve`를 명시한다.
   - `plugins`: 에디터에서 Next.js 관련 언어 서비스를 실행할 수 있도록 `{ "name": "next" }`를 목록에 추가한다.

5. 모든 next.js 프로젝트에 `@shared/ts-config`를 추가한다.

   ```bash
   # at root directory
   pnpm add @shared/ts-config --workspace --filter "@topic/*"
   ```

6. next.js 프로젝트에 추가한 `@shared/ts-config`을 적용한다.

```json
// tsconfig.json
{
  "extends": "@shared/ts-config/next.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
