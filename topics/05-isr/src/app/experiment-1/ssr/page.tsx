import { H1 } from "@shared/ui";
import { Suspense } from "react";

import { PostList } from "@/components/post-list";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function SsrPage() {
  const posts = getPosts(10000);
  return (
    <>
      <H1>실험 1: SSR</H1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <PostList posts={posts} />
      </Suspense>
    </>
  );
}
