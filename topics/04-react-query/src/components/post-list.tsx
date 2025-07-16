import { Body1, H2, H3 } from "@shared/ui";

interface PostListProps {
  posts: Post[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  DeleteButton: (props: { post: Post }) => React.ReactElement;
}

export default function PostList({
  posts,
  isLoading,
  isError,
  DeleteButton,
}: PostListProps) {
  return (
    <section className="flex flex-col gap-4">
      <H2>게시물 목록</H2>
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
            {<DeleteButton post={post} />}
          </div>
        ))}
        {isLoading && <Body1>Loading...</Body1>}
        {isError && <Body1>Error fetching data</Body1>}
      </div>
    </section>
  );
}
