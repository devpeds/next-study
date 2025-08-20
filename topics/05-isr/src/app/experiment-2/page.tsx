import { H1, Subtitle1 } from "@shared/ui";
import { Link } from "@shared/ui/next";

export default function Experiment2Page() {
  return (
    <>
      <H1>실험 2: 서버 워크로드</H1>
      <Subtitle1>
        이 실험은 일반적인 양의 데이터(50개 게시물)를 다양한 전략으로 렌더링했을
        때의 서버 워크로드를 비교합니다.
      </Subtitle1>
      <ul className="mt-8 list-disc list-inside space-y-2">
        <li>
          <Link href="/experiment-2/ssg">SSG (정적 사이트 생성)</Link>
        </li>
        <li>
          <Link href="/experiment-2/ssr">SSR (서버 사이드 렌더링)</Link>
        </li>
        <li>
          <Link href="/experiment-2/isr">ISR (증분 정적 재생성)</Link>
        </li>
      </ul>
    </>
  );
}
