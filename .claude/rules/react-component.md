---
paths:
  - "src/**/compornents/**/*.tsx"
  - "src/components/**/*.tsx"
---

# React コンポーネントルール

## クライアントコンポーネント

- ファイル先頭に `"use client"` ディレクティブを記述する
- **named export** を使う（`export function XxxForm` — default export しない）
- なるべくクライアントコンポーネントでは設計せず、基本的にはサーバコンポーネントで作成する
  - クライアントコンポーネントは局所的にする（例: フォームコンポーネントなど）

## フォームの実装パターン

Conform + Zod + `useActionState` で統一する:

```tsx
"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";

export function CreateThreadForm() {
  const [lastResult, action, isPending] = useActionState(createThread, null);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createThreadSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      aria-label="スレッド作成"
      noValidate
    >
      {/* フィールド */}
    </form>
  );
}
```

## アクセシビリティ

- `<form>` に `aria-label` を付ける（テストの `getByRole("form", { name })` で使用）
- 入力フィールドに `aria-label` または `<Label htmlFor>` を付ける
- バリデーションエラー時: `aria-invalid`, `aria-describedby` でエラーメッセージと紐付ける
- エラーメッセージは `role="alert"` を付けた `<p>` で表示する
- 送信中は `disabled={isPending}` でボタンを無効化する

```tsx
<Input
  key={fields.title.key}
  id={fields.title.id}
  name={fields.title.name}
  aria-label="スレッドタイトル"
  aria-invalid={!fields.title.valid || undefined}
  aria-describedby={!fields.title.valid ? `${fields.title.id}-error` : undefined}
/>
{fields.title.errors && (
  <p id={`${fields.title.id}-error`} className="mt-1 text-sm text-destructive" role="alert">
    {fields.title.errors[0]}
  </p>
)}
```

## その他

- 非ユーザーデータ（threadId 等）は `<input type="hidden">` で渡す
- shadcn/ui コンポーネント（Button, Input, Label, Textarea 等）を優先的に使う
