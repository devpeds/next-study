# Experiment 1. Sort & Mutation

RSC(+ 서버 액션)과 React Query를 사용해 정렬과 데이터 변경(Mutation)을 각각 구현하고, 두 방식의 동작 원리를 비교해보는 실험이다.

실험을 위해 RSC로 구현한 페이지와 React Query로 구현한 페이지 두 개를 준비하고, 두 페이지는 다음의 공통 기능을 가진다.

- 20개의 게시물 목록 렌더링
- 게시물 목록 정렬 (오름차순/내림차순)
- 새 게시물 추가
- 각 게시물 삭제

## Implementation

### RSC & Server Actions

RSC를 통해 서버 사이드에서 데이터를 받아 목록을 그려 클라언트에서 내려주고, 게시물이 추가/삭제되면 `revalidatePath("/experiment-1/server")`을 호출해 서버에서 페이지를 다시 그려 내려준다. 이때 `revalidatePath` 함수에 인자를 넘겨줄 때 쿼리 파라미터를 따로 넘겨주지 않아도 되는데, 이는 Next.js의 서버 액션에 대한 처리 방식 때문으로 보인다.

네트워크 패널로 확인해보면, 추가/삭제 버튼을 눌러 폼을 제출할 때 현재 페이지 URL에 포함된 쿼리 파라미터까지 유지된 채 POST 요청이 전송된다. Next.js는 이 요청을 처리하면서 서버 액션을 실행하고, `revalidatePath`를 호출할 때 해당 POST 요청에 포함된 쿼리 파라미터를 기반으로 페이지를 다시 렌더링하는 것으로 보인다.

### React Query (`useMutation`)

페이지를 RCC(React Client Component)로 만들고, React Query의 `useQuery`를 사용해 클라이언트(브라우저)에서 게시물 목록을 가져온다. 이때 **쿼리 키(Query Key)**에는 쿼리 파라미터를 포함해, 정렬 방식이 변경되면 목록을 새로 받아온다.

추가/삭제의 경우 `useMutation`을 사용한다. 역시 클라이언트에서 백엔드 API를 호출하며, 성공적으로 응답을 받으면 해당 게시물 목록을 캐시에서 무효화(invalidate)하여 데이터를 다시 가져온다.

## Assessment

TDB: Playwright를 사용해 다음 내용 측정

- 정렬시 UI 갱신 시간
- 추가/삭제시 UI 갱신 시간
