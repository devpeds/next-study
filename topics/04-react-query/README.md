# [Topic 04] React Query

Next.js App Router(RSC/Server Actions)와 React Query에 대한 연구

## Getting Started

```bash
pnpm install

pnpm dev # run server in development mode (http://localhost:3000)

# or
pnpm build # build the app
pnpm start # run server in production mode (http://localhost:3000)
```

## Tech Stack

- Node 22
- React 19
- Next.js 15
- TanStack Query 5

## Features

### Mock API

`src/app/api/posts/route.ts` 파일에 간단한 인메모리(in-memory) 게시물 데이터를 관리하는 API Route

- `GET /api/posts?size=[size]&sort=[asc|desc]`: 게시물 목록 조회
- `POST /api/posts`: 새 게시물 추가 (입력 없이 목 데이터 추가)
- `DELETE /api/posts?id=[id]`: 특정 ID의 게시물 삭제

### Pages

1.  **Experiment 1: Sort & Mutation**
    - `/experiment-1/server`: 서버 액션을 이용한 데이터 정렬 및 변경
    - `/experiment-1/react-query`: React Query(`useMutation`)를 이용한 데이터 정렬 및 변경

2.  **Experiment 2: Long Post List**
    - `/experiment-2/server`: 서버 컴포넌트를 이용한 데이터 조회 (Suspense 미적용)
    - `/experiment-2/server-suspense`: 서버 컴포넌트와 Suspense를 이용한 데이터 조회
    - `/experiment-2/server-edge`: Edge 런타임에서 서버 컴포넌트를 이용한 데이터 조회
    - `/experiment-2/react-query`: React Query를 이용한 데이터 조회 (Hydration 미적용)
    - `/experiment-2/react-query-hydration`: React Query와 Hydration을 이용한 데이터 조회

## Experiments

### Experiment 1. Sort & Mutation

TBD

### Experiment 2: Long Post List

TBD
