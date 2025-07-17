"use client";

import { Body1, Button, H1 } from "@shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

import { createPost, deletePost, getPosts } from "@/api";
import CreatePostForm from "@/components/create-post-form";
import PostList from "@/components/post-list";

export default function ReactQueryPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") === "desc" ? "desc" : "asc";

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["posts", sort],
    queryFn: () => getPosts(20, sort),
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

  const handleSort = () => {
    router.replace(`${pathname}?sort=${sort === "asc" ? "desc" : "asc"}`);
  };

  return (
    <main className="flex flex-col gap-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <H1>React Query</H1>
          <Body1>데이터 추가/삭제를 `useMutation`으로 처리합니다.</Body1>
        </div>
        <Button onClick={handleSort}>정렬</Button>
      </div>

      <PostList
        posts={posts}
        isLoading={isLoading}
        isError={isError}
        DeleteButton={({ post }) => (
          <Button
            color="error"
            onClick={() => deleteMutation.mutate(post.id)}
            disabled={deleteMutation.isPending}
          >
            삭제
          </Button>
        )}
      />

      <CreatePostForm onSubmit={handleCreatePost}>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "추가 중..." : "게시물 추가"}
        </Button>
      </CreatePostForm>
    </main>
  );
}
