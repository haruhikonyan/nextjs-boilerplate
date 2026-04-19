"use server";

import { prisma } from "@/lib/prisma";

/** 全スレッドを作成日時の降順で取得する。各スレッドの投稿数も含む。 */
export async function getThreads() {
  return prisma.thread.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { posts: true } } },
  });
}

/** 指定 ID のスレッドを投稿一覧（作成日時昇順）とともに取得する。存在しない場合は null。 */
export async function getThread(id: string) {
  return prisma.thread.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "asc" } },
    },
  });
}
