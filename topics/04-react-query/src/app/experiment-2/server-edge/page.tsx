import { H1 } from "@shared/ui";
import { Suspense } from "react";

import { getPosts } from "@/api";
import PostList from "@/components/post-list";

export const runtime = "edge";

export default function ServerEdgePage() {
  return (
    <main className="flex flex-col gap-8">
      <H1>서버 컴포넌트 (Edge)</H1>
      <Suspense fallback={<div>게시물 로딩 중...</div>}>
        <LongPostList />
      </Suspense>
    </main>
  );
}

async function LongPostList() {
  const posts = await getPosts(10000);
  return <PostList posts={posts} />;
}
