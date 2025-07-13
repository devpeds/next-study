# Workspace 도입

Monorepo를 적용하기 위해 pnpm workspace를 도입한 과정에 대한 문서다.

## Steps

1. 프로젝트 루트에 `package.json`과 `pnpm-workspace.yaml`을 생성한다.

   ```bash
   # at project root
   pnpm init
   touch pnpm-workspace.yaml
   ```

2. `pnpm-workspace.yaml`에 워크스페이스에 추가할 프로젝트들 경로를 추가한다.

   ```yaml
   # pnpm-workspace.yaml
   packages:
     - topics/*
   ```

3. 기존 프로젝트마다 관리되던 `pnpm-lock.yaml` 파일을 삭제하고 프로젝트 루트에서 디펜던시를 설치한다.

   ```bash
   # at project root
   rm -rf topics/**/pnpm-lock.yaml
   pnpm install
   ```

## 도입 결과

**테스트 환경**

- 기기: 맥북 프로 14 (2023년) / Apple M2 Pro / 메로리 32GB
- 패키지 수: 2개 (`topics/01-next-auth`, `topics/02-next-auth-v5`)

**성능 비교**

|                             | AS IS  |  TO BE  | Change(%) |
| --------------------------: | :----: | :-----: | :-------: |
|                        Size | 1.84GB | 920.8MB |  -49.9%   |
|  Install Time<br>(w/ Cache) |  ~5s   |   ~3s   |   -40%    |
| Install Time<br>(w/o Cache) |  ~23s  |  ~17s   |  -26.1%   |

> - Size: 루트 디렉토리 크기
> - Install Time
>   - w/ Cache: pnpm 스토어에 프로젝트 디펜던시가 전부 설치되어 있고 `node_modules`는 없는 상태
>   - w/o Cache: pnpm 스토어, `node_modules` 모두 없는 상태

## Troubleshooting

### 레포지토리 용량 문제

pnpm workspace 도입 이후 공통 라이브러리, 커맨드라인 도구 개발 등 여러 작업들을 진행하면서 레포지토리의 용량이 도입 전보다 커지는 상황이 발생했다. 여러 도구들을 개발하면서 종속성이 여러개 추가되긴 했지만, 서로 공유하는 패키지도 있어 필요 이상으로 레포지토리 용량이 크다고 판단해 `du` 명령어를 사용해 각 경로별 용량을 분석해보았다.

| Directory        | Size  |
| :--------------- | :---: |
| `.`              | 2.1GB |
| `./node_modules` | 1.2GB |
| `./topics`       | 880MB |
| `./packages`     | 744KB |

위 테이블에서 보듯이 `./packages`에 비해 `./topics`의 크기가 매우 것을 확인할 수 있다. 이에 `./topics` 디렉토리의 모든 `node_modules`를 삭제하고 다시 설치하니 크기가 808KB로 **약 99.9% 감소**했다.

pnpm은 `node_modules/.pnpm`에 프로젝트에서 사용하는 모든 의존성과 그 하위 의존성을 하드 링크 형태로 저장하고, 패키지에서 사용하는 의존성을 심볼릭 링크로 `node_modules`의 최상위에 연결시킨다. 그런데 기존 패키지에 workspace를 도입했을 때, 해당 경로의 `.pnpm` 디렉토리가 계속 남아있어 용량이 비정상적으로 컸던 것으로 보인다.

또한, 기존 `01-next-auth`와 `02-next-auth-v5`는 서로 다른 Next.js 버전을 사용했으나, 다른 버전을 사용할 이유가 특별히 없었기 때문에 두 앱 모두 동일한 버전을 사용하도록 정리했다. 수정 후 `pnpm-lock.yaml`파일에서는 모두 같은 Next.js 버전을 사용하는 것으로 명시되어 있었지만, 실제 `.pnpm`에는 이전에 사용하던 Next.js 패키지가 남아있어 루트에 있는 `node_modules` 역시 삭제 후 재설치했다. 재설치 이후 레포지토리의 용량은 아래와 같이 변했다.

| Directory        | AS-IS | TO-BE | Change |
| :--------------- | :---: | :---: | :----: |
| `.`              | 2.1GB | 550MB | 74.4%  |
| `./node_modules` | 1.2GB | 542MB | 55.9%  |
| `./topics`       | 880MB | 808KB | 99.9%  |
| `./packages`     | 744KB | 744KB |   --   |

참고로 프로젝트 루트에서 `du -sh node_modules/.pnpm/* | sort -hr | head -n 10`을 실행하면 `.pnpm`에 저장된 패키지 중 크기 상위 10개를 확인할 수 있다. 출력 결과를 보면 최상위 2개 모두 Next.js 관련 패키지이며, 둘이 합쳐 260MB로 `node_modules` 전체 크기 중 50% 이상을 차지하는 것을 알 수 있다.

```bash
141M    node_modules/.pnpm/next@15.3.5_@babel+core@7.27.7_react-dom@19.1.0_react@19.1.0__react@19.1.0
129M    node_modules/.pnpm/@next+swc-darwin-arm64@15.3.5
 22M    node_modules/.pnpm/typescript@5.8.2
 21M    node_modules/.pnpm/@prisma+client@6.10.1_prisma@6.10.1_typescript@5.8.2__typescript@5.8.2
 18M    node_modules/.pnpm/prisma@6.10.1_typescript@5.8.2
 15M    node_modules/.pnpm/@img+sharp-libvips-darwin-arm64@1.1.0
 10M    node_modules/.pnpm/es-abstract@1.24.0
9.4M    node_modules/.pnpm/@esbuild+darwin-arm64@0.25.5
8.2M    node_modules/.pnpm/prettier@3.6.2
7.4M    node_modules/.pnpm/lightningcss-darwin-arm64@1.30.1
```
