import { Body1, H1, H2 } from "@shared/ui";
import { LinkButton } from "@shared/ui/next";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <H1>Lab 2: Long Post List</H1>
      <Body1>
        이 실습에서는 긴 게시물 목록을 로딩할 때 Next.js의 서버 컴포넌트,
        Suspense, 그리고 React Query의 Hydration 전략이 성능에 미치는 영향을
        비교합니다. 각 페이지는 10,000개 이상의 게시물을 가져와 렌더링합니다.
      </Body1>

      <div className="mt-4 p-4 border rounded-lg">
        <H2>공통 기능</H2>
        <ul className="list-disc list-inside mt-2">
          <li>10,000개 이상의 게시물 목록 가져오기 (긴 응답 시간)</li>
          <li>게시물 목록 렌더링</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <LinkButton href="/lab-2/server" variant="filled" color="primary">
          서버 컴포넌트 (No Suspense)
        </LinkButton>
        <LinkButton
          href="/lab-2/server-suspense"
          variant="filled"
          color="primary"
        >
          서버 컴포넌트 (Suspense)
        </LinkButton>
        <LinkButton href="/lab-2/server-edge" variant="filled" color="primary">
          서버 컴포넌트 (Edge)
        </LinkButton>
        <LinkButton href="/lab-2/react-query" variant="filled" color="primary">
          React Query (No Hydration)
        </LinkButton>
        <LinkButton
          href="/lab-2/react-query-hydration"
          variant="filled"
          color="primary"
        >
          React Query (Hydration)
        </LinkButton>
      </div>
    </main>
  );
}
