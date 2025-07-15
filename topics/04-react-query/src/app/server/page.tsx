import { Body1, Button, H1, H2, H3 } from "@shared/ui";

import { getPosts } from "@/api";

import { actionCreate, actionDelete } from "./actions";

export default async function ServerPage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <H1>서버 액션</H1>
        <Body1>데이터 추가/삭제를 서버 액션으로 처리합니다.</Body1>
      </div>

      <section className="flex flex-col gap-4">
        <H2>게시물 목록</H2>
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <H3>{post.title}</H3>
                <Body1>{post.content}</Body1>
              </div>
              <form action={actionDelete}>
                <input hidden readOnly name="id" value={post.id} />
                <Button color="error">삭제</Button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <H2>새 게시물 추가</H2>
        <form
          action={actionCreate}
          className="flex flex-col gap-4 p-4 border rounded-md"
        >
          <Button type="submit">새 게시물 추가</Button>
        </form>
      </section>
    </div>
  );
}
