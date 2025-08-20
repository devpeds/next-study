import { PostCard } from "./post-card";
import type { Post } from "@/lib/posts";

export const PostList = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
