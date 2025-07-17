import { Body1, H1, H2 } from "@shared/ui";
import { LinkButton } from "@shared/ui/next";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <H1>Sort & Mutation</H1>
      <Body1>
        이 실습에서는 Next.js의 서버 컴포넌트 및 서버 액션과 React Query를
        사용한 데이터 관리 방식의 차이점을 비교합니다. 아래 두 페이지는 동일한
        기능을 각기 다른 방식으로 구현했습니다.
      </Body1>

      <div className="mt-4 p-4 border rounded-lg">
        <H2>공통 기능</H2>
        <ul className="list-disc list-inside mt-2">
          <li>20개의 게시물 목록 가져오기</li>
          <li>게시물 목록 렌더링</li>
          <li>게시물 목록 정렬 (오름차순/내림차순)</li>
          <li>새 게시물 추가</li>
          <li>각 게시물 삭제</li>
        </ul>
      </div>

      <div className="flex flex-warp gap-4 mt-4">
        <LinkButton href="/lab-1/server" variant="filled" color="primary">
          서버 컴포넌트 예제
        </LinkButton>
        <LinkButton href="/lab-1/react-query" variant="filled" color="primary">
          React Query 예제
        </LinkButton>
      </div>
    </main>
  );
}
