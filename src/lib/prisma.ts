import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "@/utils/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * アプリケーション全体で共有する Prisma クライアントシングルトン。
 * 開発環境でのホットリロード時に複数インスタンスが生成されないよう globalThis に保持する。
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(env.DATABASE_URL),
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
