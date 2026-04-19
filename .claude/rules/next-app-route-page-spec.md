---
paths:
  - "src/app/**/page.spec.tsx"
---

# ページテストルール

## テスト構造

- AAA パターン（`// Arrange` / `// Act` / `// Assert`）でコメントを書く
- `describe("PageName")` → `it("〇〇した時、△△される")` の形式

## デフォルトモック

以下は `__mocks__` ファイルが存在するため、ファクトリなしで呼ぶ:

```ts
vi.mock("@/lib/prisma");
vi.mock("next/link");
vi.mock("next/navigation");
```

専用の挙動が必要なモックのみインラインファクトリを使う:

```ts
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
```

## Server Component のテストパターン

動的インポートで取得し、`await Page()` → `render(jsx)` で SSR テスト:

```tsx
const { default: BoardPage } = await import("@/app/(app)/board/page");
const jsx = await BoardPage();
render(jsx);
```

`params` がある場合は `Promise.resolve(...)` でラップ:

```tsx
const jsx = await ThreadPage({
  params: Promise.resolve({ threadId: thread.id }),
});
```

## テストクエリの優先順位

testing-library Priority に従う: `getByRole` > `getByLabelText` > `getByText`

フォーム内の要素は `within()` でスコープを絞る:

```tsx
const form = screen.getByRole("form", { name: "スレッド作成" });
expect(within(form).getByRole("textbox", { name: "スレッドタイトル" })).toBeInTheDocument();
```

## フォーム送信テスト

`userEvent` で入力 → 送信 → `waitFor` で DB 状態を検証:

```tsx
const user = userEvent.setup();
await user.type(screen.getByRole("textbox", { name: "スレッドタイトル" }), "新しいスレッド");
await user.click(screen.getByRole("button", { name: "作成" }));

const prisma = getTestPrisma();
await waitFor(async () => {
  const threads = await prisma.thread.findMany();
  expect(threads).toHaveLength(1);
});
```

## redirect / notFound の検証

`__mocks__/next/navigation.ts` の `vi.fn()` を利用:

```tsx
import { redirect } from "next/navigation";

// redirect の検証
vi.mocked(redirect).mockClear();
// ... フォーム送信 ...
expect(redirect).toHaveBeenCalledWith(`/board/${threads[0].id}`);

// notFound の検証
await expect(
  ThreadPage({ params: Promise.resolve({ threadId: "nonexistent" }) }),
).rejects.toThrow("NEXT_NOT_FOUND");
```
