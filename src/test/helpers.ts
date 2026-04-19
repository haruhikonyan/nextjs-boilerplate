import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "@/utils/env";

let _prisma: PrismaClient | undefined;

/** テスト用 Prisma クライアントのシングルトンを返す。TEST_DATABASE_URL が未設定の場合は DATABASE_URL を使用する。 */
export function getTestPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient({
      adapter: new PrismaPg(env.TEST_DATABASE_URL ?? env.DATABASE_URL),
    });
  }
  return _prisma;
}

/** テスト用データベースの全レコードを削除する。各テストの beforeEach で呼び出してデータを初期化する。 */
export async function cleanDatabase() {
  const prisma = getTestPrisma();
  await prisma.post.deleteMany();
  await prisma.thread.deleteMany();
}

/** テスト用 Prisma クライアントの接続を切断し、インスタンスを破棄する。テストスイート終了時（afterAll）に呼び出す。 */
export async function disconnectDatabase() {
  if (_prisma) {
    await _prisma.$disconnect();
    _prisma = undefined;
  }
}
