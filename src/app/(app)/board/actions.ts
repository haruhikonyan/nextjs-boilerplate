"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createThreadSchema } from "./schema";

/**
 * スレッドを作成する Server Action。
 * バリデーション成功時はスレッドを DB に保存し、スレッドページへリダイレクトする。
 */
export async function createThread(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: createThreadSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const thread = await prisma.thread.create({
    data: { title: submission.value.title },
  });

  redirect(`/board/${thread.id}`);
}
