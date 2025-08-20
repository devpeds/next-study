import { H1 } from "@shared/ui";

import { PostList } from "@/components/post-list";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function SsrPage() {
  const posts = getPosts(50);
  return (
    <>
      <H1>실험 2: SSR</H1>
      <PostList posts={posts} />
    </>
  );
}
