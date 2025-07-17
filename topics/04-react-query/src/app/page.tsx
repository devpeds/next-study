import { Body1, Button, H1 } from "@shared/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <H1>Next.js 데이터 관리: 서버 vs. 클라이언트</H1>
      <Body1>
        이 프로젝트는 Next.js App Router 환경에서 다양한 데이터 관리 전략을
        비교하고 실험하기 위해 만들어졌습니다.{" "}
        <strong className="text-red-500">Lab 1</strong>에서는 서버 액션과 React
        Query의 데이터 변경(Mutation) 패턴을 비교하고,{" "}
        <strong className="text-red-500">Lab 2</strong>에서는 대용량 데이터 로딩
        시 서버 컴포넌트(Suspense, Edge)와 React Query(Hydration)의 성능 및
        사용자 경험 차이를 분석합니다.
      </Body1>
      <div className="flex flex-wrap gap-4">
        <Link href="/lab-1">
          <Button>Lab 1: Sort & Mutation</Button>
        </Link>
        <Link href="/lab-2">
          <Button>Lab 2: Long Post List</Button>
        </Link>
      </div>
    </main>
  );
}
