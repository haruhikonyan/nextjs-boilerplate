---
paths:
  - "src/**/actions.ts"
---

# Server Actions ルール

## 必須事項

- ファイル先頭に `"use server"` ディレクティブを記述する
- `"use server"` ファイルからは **async 関数のみ** エクスポート可能。Zod スキーマ等の定数は同ディレクトリの `schema.ts` に分離する
- vitest は `"use server"` 制約を検出できない。ランタイムエラーの検出には `pnpm build` が必要

## 配置ルール

- **データ取得系**（`getXxx`）: `src/features/<機能名>/actions.ts` に配置
- **フォーム処理系**（`createXxx` 等）: ページ同ディレクトリの `actions.ts` に配置

## フォーム Action のパターン

- シグネチャ: `(_prev: unknown, formData: FormData)`
- バリデーション: `parseWithZod(formData, { schema })` を使用
- 成功時: DB 操作 → `redirect()` or `revalidatePath()` + `submission.reply()`
- 失敗時: `submission.reply()` をそのまま返す

```ts
"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createThreadSchema } from "./schema";

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
```
