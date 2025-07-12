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
