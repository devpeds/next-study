import { H4, Body1, Caption } from "@shared/ui";
import type { Post } from "@/lib/posts";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <H4 className="mb-2">{post.title}</H4>
      <Caption className="mb-2">{post.createdAt}</Caption>
      <Body1>{post.body}</Body1>
    </div>
  );
};
