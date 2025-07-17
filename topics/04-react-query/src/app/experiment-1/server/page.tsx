import { Body1, Button, H1 } from "@shared/ui";
import Link from "next/link";

import { getPosts } from "@/api";
import CreatePostForm from "@/components/create-post-form";
import PostList from "@/components/post-list";

import { actionCreate, actionDelete } from "./actions";

export default async function ServerPage({
  searchParams,
}: {
  searchParams: { sort?: "asc" | "desc" };
}) {
  const sort = searchParams.sort || "asc";
  const posts = await getPosts(20, sort);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>서버 액션</H1>
          <Body1>데이터 추가/삭제를 서버 액션으로 처리합니다.</Body1>
        </div>
        <Link
          href={`/lab-1/server?sort=${sort === "asc" ? "desc" : "asc"}`}
          replace
        >
          <Button>정렬</Button>
        </Link>
      </div>

      <PostList
        posts={posts}
        DeleteButton={({ post }) => (
          <form action={actionDelete}>
            <input hidden readOnly name="id" value={post.id} />
            <Button color="error">삭제</Button>
          </form>
        )}
      />

      <CreatePostForm action={actionCreate}>
        <Button type="submit">새 게시물 추가</Button>
      </CreatePostForm>
    </div>
  );
}
