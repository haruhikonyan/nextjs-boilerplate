---
paths:
  - "src/test/factories/**/*.ts"
---

# テストファクトリルール

## 実装パターン

- fishery の `Factory.define<PrismaModel>` で定義する
- 型引数には Prisma が生成したモデル型を指定する
- `onCreate` コールバックでテスト用 DB に永続化する
- `@faker-js/faker` でデフォルト値を生成する

```ts
import { faker } from "@faker-js/faker";
import type { Thread } from "@prisma/client";
import { Factory } from "fishery";
import { getTestPrisma } from "@/test/helpers";

export const threadFactory = Factory.define<Thread>(({ onCreate }) => {
  onCreate(async (thread) => {
    const prisma = getTestPrisma();
    return prisma.thread.create({
      data: {
        title: thread.title,
      },
    });
  });

  return {
    id: faker.string.nanoid(),
    title: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
});
```

## 使い方

- `await factory.create({ ... })`: DB に保存してレコードを返す（オーバーライド可能）
- デフォルト値は faker で生成されるため、テスト固有の値のみオーバーライドする
- リレーション先の ID（`threadId` 等）はテスト側で明示的に渡す
