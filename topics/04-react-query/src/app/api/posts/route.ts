let posts: Post[] = Array.from({ length: 10000 }, (_, id) => createPost(id));

let nextId = posts.length;

function createPost(id: number): Post {
  return {
    id: `${id}`,
    title: `Post #${id}`,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, " +
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris " +
      "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " +
      "in reprehenderit in voluptate velit esse cillum dolore eu fugiat " +
      "nulla pariatur. Excepteur sint occaecat cupidatat non proident, " +
      "sunt in culpa qui officia deserunt mollit anim id est laborum.",
  };
}

function safeNumber(value: unknown) {
  const number = Number(value);
  if (isNaN(number)) {
    return 0;
  }

  return number;
}

// 모든 게시물 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = safeNumber(searchParams.get("page"));
  const size = safeNumber(searchParams.get("size")) || 20;

  return Response.json(posts.slice(page * size, (page + 1) * size));
}

// 새 게시물 추가
export async function POST() {
  const newPost = createPost(nextId++);
  posts.push(newPost);
  return Response.json(newPost, { status: 201 });
}

// 게시물 삭제
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const initialLength = posts.length;
  posts = posts.filter((post) => post.id !== id);

  if (posts.length < initialLength) {
    return new Response(null, { status: 204 }); // No Content
  } else {
    return new Response(JSON.stringify({ message: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}
