import { Body1, Button, H1 } from "@shared/ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <H1>Next.js 데이터 관리: 서버 vs. 클라이언트</H1>
      <Body1>
        이 프로젝트는 Next.js의 서버 컴포넌트 및 서버 액션과 React Query를
        사용한 데이터 관리 방식의 차이점을 비교하기 위해 만들어졌습니다.
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
