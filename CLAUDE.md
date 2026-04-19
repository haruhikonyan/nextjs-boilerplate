# プロジェクト概要

Nextjs を利用した開発のためのボイラープレートであり、簡単な誰でも書き込める掲示板アプリをサンプルとして提供する

**技術スタック**: Nextjs, React, tailwind, shadcn/ui, Zod, Conform, prisma, PostgreSQL, vitest, React Testing Library, faker
## 必須ルール
全ての指示は日本語で行い、返答も日本語で行なってください。

明示的な issue が与えられた場合は `gh` コマンドを利用して issue を参照し、issue の内容を理解した上で作業を行うこと。
不明点があればユーザに都度確認をしながら作業を進めること。

### 1. 作業開始時は必ず `/implementation-planning` を最初に使用して実装計画を立てること。
EnterPlanMode で実行計画を立てユーザからの承認を得てから実装に入ること。

### 2. 作成した実装計画に応じて、実装もしくはリファクタリングを行うこと。
リファクタリングの場合は `/code-refactoring` スキルを利用してコードのリファクタリングを行うこと。
実装の場合は `/feature-developing` スキルを利用して実装を行うこと。

最初に実装内容から feature/ から始まるブランチ名を考えブランチを作成してから作業開始します
明示的に issue が渡されている場合は feature/xxx- のように issue 番号もブランチ名に含めてください
例: feature/123-add-user-authentication

### 3. コード編集完了後 `/pull-request-creating` スキルを利用して PR を作成すること。
PR 作成まで完了したらユーザに確認を依頼する
依頼の際に特に確認したほうがいい場所などがあれば合わせて伝えること

### 4. ユーザからのフィードバックがあった場合は 1. へ戻り、修正を行う
修正完了後、新たに instructions の更新が必要な場合は `/instructions-updating` スキルを利用して instructions の更新も行うこと。

## プロジェクト構造
```
src/
├── app/                  # ルーティング定義のみ（ロジックは書かない）
│   ├── (public)/         # LPなど
│   ├── (app)/            # アプリ本体
│   │   ├── board/
│   │   │   └── page.tsx      # ロジックは書かない
│   │   │   └── actions.ts    # このページでしか呼ばれない actions
│   │   │   └── page.spec.ts  # このページに対するテスト
│   │   │   └── compornets/   # このページでしか呼ばれないコンポーネント
│   │   └── layout.tsx
│   ├── api/              # Route Handlers
│   ├── globals.css
│   └── layout.tsx
│
├── components/           # アプリ全体で使う「汎用」コンポーネント
│   ├── ui/               # shadcn/ui (Button, Input等)
│   ├── layouts/          # Header, Footer, Sidebar
│   └── elements/         # その他汎用パーツ (Loading, Error等)
│
├── features/             # 汎用的な機能単位で切る
│   ├── posts/            # 投稿機能
│   │   ├── components/   # PostList, PostCard
│   │   └── actions.ts    # createPost, deletePost, getPosts
│   │
│   └── users/            # ユーザー機能
│
├── lib/                  # 外部ライブラリの設定・ラッパー
│   ├── prisma.ts         # DB接続
│   └── stripe.ts
│
├── utils/                # 汎用的なロジック
│   ├── parse.ts          # パースとかロジック
│   └── parse.spec.ts     # util の単体テスト
│
├── test/                 # テストに必要なファイル
│   └── factories         # fishery と faker を利用したテスト用の mock データ
│
└── types/                # アプリ全体で使う型（env.d.ts等）
```

## 主要コマンド

```bash
pnpm dev            # 開発サーバー起動
pnpm build          # プロダクションビルド
pnpm test           # テスト実行 (vitest)
pnpm test:watch     # テスト監視モード
pnpm lint           # lint チェック (biome)
pnpm format         # フォーマット (biome)
pnpm prisma generate  # Prisma Client 生成
pnpm prisma db push   # スキーマを DB に反映
```
