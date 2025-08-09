import { Body1, CodeInline, H1, H2 } from "@shared/ui";
import { LinkButton } from "@shared/ui/next";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <H1>Sort & Mutation</H1>
      <Body1>
        이 실습은 <strong>데이터 정렬 및 변경(Mutation)</strong> 시나리오에
        중점을 둡니다. Next.js 서버 액션과 React Query(
        <CodeInline>useMutation</CodeInline>
        )를 사용하는 방식의 구현 차이, 장단점을 비교합니다. 두 페이지는 동일한
        기능을 제공하지만, 상태 관리 및 서버 통신 방식에서 근본적인 차이가
        있습니다.
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
        <LinkButton href="/experiment-1/server" variant="filled" color="primary">
          서버 컴포넌트 예제
        </LinkButton>
        <LinkButton href="/experiment-1/react-query" variant="filled" color="primary">
          React Query 예제
        </LinkButton>
      </div>
    </main>
  );
}
