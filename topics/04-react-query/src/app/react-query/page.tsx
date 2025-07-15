"use client";

import { Body1, Button, H1, H2, H3 } from "@shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";

import { createPost, deletePost, getPosts } from "@/api";

export default function ReactQueryPage() {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleCreatePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate();
  };

  return (
    <main className="flex flex-col gap-8">
      <div>
        <H1>React Query</H1>
        <Body1>데이터 추가/삭제를 `useMutation`으로 처리합니다.</Body1>
      </div>

      <section className="flex flex-col gap-4">
        <H2>게시물 목록</H2>
        {isLoading && <Body1>Loading...</Body1>}
        {isError && <Body1>Error fetching data</Body1>}
        <div className="flex flex-col gap-2">
          {posts?.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <H3>{post.title}</H3>
                <Body1>{post.content}</Body1>
              </div>
              <Button
                color="error"
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={deleteMutation.isPending}
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <H2>새 게시물 추가</H2>
        <form
          onSubmit={handleCreatePost}
          className="flex flex-col gap-4 p-4 border rounded-md"
        >
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "추가 중..." : "추가"}
          </Button>
        </form>
      </section>
    </main>
  );
}
