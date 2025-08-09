import { H1 } from "@shared/ui";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getPosts } from "@/api";
import { getQueryClient } from "@/react-query/client";

import { HydratedPostList } from "./client";

export default async function ReactQueryHydrationPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", 10000],
    queryFn: () => getPosts(10000),
  });

  return (
    <main className="flex flex-col gap-8">
      <H1>React Query (Hydration)</H1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HydratedPostList />
      </HydrationBoundary>
    </main>
  );
}
