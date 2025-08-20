import { H1, Subtitle1 } from "@shared/ui";
import { Link } from "@shared/ui/next";

export default function Home() {
  return (
    <>
      <H1>ISR 실험</H1>
      <Subtitle1 className="text-foreground">
        이 앱은 Next.js에서 SSR, SSG, ISR을 비교하기 위한 실험을 포함합니다.
      </Subtitle1>
      <div className="mt-8 space-y-4">
        <div>
          <Link href="/experiment-1">
            <h2 className="text-xl font-bold">실험 1: 웹 바이탈</h2>
          </Link>
          <p>
            많은 양의 데이터(10,000개 게시물)로 페이지 로드 성능을 비교합니다.
          </p>
        </div>
        <div>
          <Link href="/experiment-2">
            <h2 className="text-xl font-bold">실험 2: 서버 워크로드</h2>
          </Link>
          <p>
            일반적인 양의 데이터(50개 게시물)로 서버 응답 시간을 비교합니다.
          </p>
        </div>
      </div>
    </>
  );
}
