"use server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "./schema";

/**
 * 投稿を作成する Server Action。
 * バリデーション成功時は投稿を DB に保存し、スレッドページを再検証してフォームをリセットする。
 */
export async function createPost(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: createPostSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const { threadId, author, content } = submission.value;

  await prisma.post.create({
    data: { threadId, author, content },
  });

  revalidatePath(`/board/${threadId}`);
  return submission.reply({ resetForm: true });
}
