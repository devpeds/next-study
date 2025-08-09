"use client";

import { H1 } from "@shared/ui";
import { useQuery } from "@tanstack/react-query";

import { getPosts } from "@/api";
import PostList from "@/components/post-list";

export default function ReactQueryPage() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts", 10000],
    queryFn: () => getPosts(10000),
  });

  return (
    <main className="flex flex-col gap-8">
      <H1>React Query (No Hydration)</H1>
      <PostList posts={posts} isLoading={isLoading} isError={isError} />
    </main>
  );
}
