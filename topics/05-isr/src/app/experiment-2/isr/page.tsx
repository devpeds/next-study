import { H1 } from "@shared/ui";

import { PostList } from "@/components/post-list";
import { getPosts } from "@/lib/posts";

export const revalidate = 60;

export default function IsrPage() {
  const posts = getPosts(50);
  return (
    <>
      <H1>실험 2: ISR</H1>
      <PostList posts={posts} />
    </>
  );
}
