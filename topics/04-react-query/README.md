# [Topic 04] React Query

Next.js의 서버 컴포넌트 및 서버 액션과 React Query를 사용한 클라이언트 사이드 데이터 관리 방식의 차이점을 비교하고, 각 방식의 장단점을 직접 경험할 수 있도록 구현된 예제 프로젝트.

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

`src/app/api/posts/route.ts` 파일에 간단한 인메모리(in-memory) 게시물 데이터를 관리하는 API Route를 구현.

- `GET /api/posts?page=[page]&size=[size]`: 게시물 목록 조회 (페이지네이션 지원)
- `POST /api/posts`: 새 게시물 추가 (입력 없이 목 데이터 추가)
- `DELETE /api/posts?id=[id]`: 특정 ID의 게시물 삭제

### Pages

두 가지 데이터 관리 방식을 비교할 수 있도록 다음 페이지들을 구현.

1.  **`/server` (Next.js 네이티브 방식)**
    - **데이터 조회 (Read):** 서버 컴포넌트에서 `fetch`를 사용해 직접 데이터를 가져옴. 로딩 상태는 Next.js의 `loading.tsx`를 통해 처리.
    - **데이터 변경 (Create/Delete):** 서버 액션을 사용해 게시물 추가 및 삭제를 처리. 데이터 변경 후 `revalidatePath`를 호출해 UI를 갱신.
    - **특징:** 초기 로딩 속도 빠름. 클라이언트 사이드 JavaScript 적게 필요. 서버에서 모든 로직을 처리해 간결.

2.  **`/react-query` (React Query 방식)**
    - **데이터 조회 (Read):** 클라이언트 컴포넌트에서 `useQuery` 훅을 사용해 데이터를 가져옴. `isLoading`, `isError` 상태를 통해 로딩 및 에러 UI를 처리.
    - **데이터 변경 (Create/Delete):** `useMutation` 훅을 사용해 게시물 추가 및 삭제를 구현. `onSuccess` 콜백에서 `queryClient.invalidateQueries`를 호출해 쿼리를 무효화하고 자동으로 리페칭.
    - **특징:** 강력한 클라이언트 캐싱, 자동 리페칭, 낙관적 업데이트 등 React Query의 고급 데이터 관리 기능을 활용.

## 언제 무엇을 사용할까?

| 특징 / 방식          | Next.js 네이티브 (서버 컴포넌트/액션)                                                  | React Query (클라이언트 컴포넌트)                                                             |
| :------------------- | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| **초기 로딩 성능**   | 매우 빠름 (서버에서 HTML 생성)                                                         | 초기 로딩 후 클라이언트에서 데이터 페칭 시작                                                  |
| **SEO**              | 유리함 (서버에서 렌더링된 콘텐츠)                                                      | 클라이언트에서 데이터 로드 후 콘텐츠 생성 (SEO에 불리할 수 있음)                              |
| **데이터 변경**      | 서버 액션으로 처리, `revalidatePath`로 데이터 갱신                                     | `useMutation`으로 처리, `queryClient.invalidateQueries`로 캐시 무효화 및 리페칭               |
| **캐싱**             | Next.js의 `fetch` 캐싱 (기본적으로 요청당 캐싱)                                        | React Query의 강력한 클라이언트 캐싱 (자동 리페칭, stale-while-revalidate)                    |
| **복잡한 UI 상태**   | 클라이언트 컴포넌트와 `useState`, `useEffect` 조합 필요                                | `useQuery`, `useMutation` 등으로 간편하게 관리                                                |
| **네트워크 요청 수** | 데이터 변경 시 전체 페이지 리프레시 또는 부분 리페칭                                   | 필요한 쿼리만 리페칭, 중복 요청 방지                                                          |
| **적합한 시나리오**  | SEO가 중요하고, 데이터 변경이 빈번하지 않은 정적/반정적 페이지 (블로그, 마케팅 페이지) | 복잡한 클라이언트 상태 관리, 실시간 데이터 동기화, 고도의 UX가 필요한 대시보드, 관리자 페이지 |
