"use client";

import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/api";
import PostList from "@/components/post-list";

export function HydratedPostList() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts", 10000],
    queryFn: () => getPosts(10000),
  });

  return <PostList posts={posts} isLoading={isLoading} isError={isError} />;
}
