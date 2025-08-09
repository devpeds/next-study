const BASE_URL = "http://localhost:3000";

export async function getPosts(
  size: number = 20,
  sort: "asc" | "desc" = "asc",
): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/api/posts?size=${size}&sort=${sort}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}

export async function createPost(): Promise<Post> {
  const res = await fetch("http://localhost:3000/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to create post");
  }
  return res.json();
}

export async function deletePost(id: string) {
  const res = await fetch(`http://localhost:3000/api/posts?id=${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete post");
  }
}
