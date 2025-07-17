"use server";

import { revalidatePath } from "next/cache";

import { createPost, deletePost } from "@/api";

export async function actionCreate() {
  await createPost();
  revalidatePath("/server");
}

export async function actionDelete(formData: FormData) {
  const id = formData.get("id");
  if (!id) {
    throw new Error("id not found");
  }

  await deletePost(id as string);
  revalidatePath("/server");
}
