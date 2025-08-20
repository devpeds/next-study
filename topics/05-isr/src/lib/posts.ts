export interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

export const getPosts = (count: number): Post[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `This is the body of post ${i + 1}.`,
    createdAt: new Date().toISOString(),
  }));
};
