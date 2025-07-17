import { H1 } from "@shared/ui";

import { getPosts } from "@/api";
import PostList from "@/components/post-list";

export default async function ServerPage() {
  const posts = await getPosts(10000);

  return (
    <main className="flex flex-col gap-8">
      <H1>서버 컴포넌트 (No Suspense)</H1>
      <PostList posts={posts} />
    </main>
  );
}
