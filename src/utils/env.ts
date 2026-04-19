import { z } from "zod";

/**
 * 環境変数のバリデーションスキーマ。
 * 未設定の必須変数がある場合はサーバー起動時に Zod がエラーをスローする。
 */
const envSchema = z.object({
  /** アプリケーション用データベース接続 URL（必須） */
  DATABASE_URL: z.string().url(),
  /** テスト用データベース接続 URL（省略時は DATABASE_URL を使用） */
  TEST_DATABASE_URL: z.string().url().optional(),
  /** 実行環境 */
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/** 検証済み環境変数。アプリケーション全体でこのオブジェクトを通じて参照する。 */
export const env = envSchema.parse(process.env);
