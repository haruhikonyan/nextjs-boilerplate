---
paths:
  - "src/app/**/page.tsx"
---

# ページコンポーネントルール

## 必須事項

- Server Component として実装する（`"use client"` を書かない）
- `export default async function` 形式でエクスポートする
- データ取得は `src/features/` 配下の actions を呼び出す（ページ内に DB ロジックを書かない）

## ディレクトリ構成

ページ固有のファイルは同ディレクトリに配置する:

```
src/app/(app)/board/
├── page.tsx          # ページコンポーネント（Server Component）
├── page.spec.tsx     # ページテスト
├── actions.ts        # ページ固有の Server Actions
├── schema.ts         # ページ固有の Zod スキーマ
└── compornents/      # ページ固有のクライアントコンポーネント
    └── CreateThreadForm.tsx
```

## 実装パターン

- 空状態は三項演算子でハンドリングする
- 存在しないリソースは `notFound()` を呼ぶ
- クライアント側のインタラクション（フォーム等）は `compornents/` 内のコンポーネントに分離する

```tsx
import { getThreads } from "@/features/threads/actions";
import { CreateThreadForm } from "./compornents/CreateThreadForm";

export default async function BoardPage() {
  const threads = await getThreads();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">スレッド一覧</h1>
      <CreateThreadForm />
      {threads.length === 0 ? (
        <p className="text-muted-foreground">まだスレッドがありません。</p>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            /* スレッド表示 */
          ))}
        </div>
      )}
    </div>
  );
}
```
