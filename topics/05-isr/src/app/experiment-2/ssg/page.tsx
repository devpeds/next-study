import { H1 } from "@shared/ui";

import { PostList } from "@/components/post-list";
import { getPosts } from "@/lib/posts";

export default function SsgPage() {
  const posts = getPosts(50);
  return (
    <>
      <H1>실험 2: SSG</H1>
      <PostList posts={posts} />
    </>
  );
}
