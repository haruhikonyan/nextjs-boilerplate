"use server";

import { prisma } from "@/lib/prisma";

/** 指定スレッドの投稿を作成日時の昇順で取得する。 */
export async function getPosts(threadId: string) {
  return prisma.post.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
  });
}
