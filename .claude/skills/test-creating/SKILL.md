---
name: test-creating
description: 新規実装やリファクタを行う際のテスト作成、編集のスキル
---

# テスト作成スキル

実装・リファクタリングに合わせて適切なテストを作成するスキル。

## When to use

- 新しいページ・コンポーネント・Server Actions を実装したとき
- 既存のコードを変更したとき
- リファクタリング前に動作を保証するテストが必要なとき

## Checklist / Instructions

- [ ] 変更・追加したファイルの種類に応じてテストの種類を決める
  - ページ (`src/app/`) → 同ディレクトリに `page.spec.tsx`（SSR 込みインテグレーションテスト）
  - ユーティリティ (`src/utils/`) → 同ディレクトリに `*.spec.ts`（ユニットテスト）
- [ ] 新規ファクトリが必要な場合は `src/test/factories/` に追加する
- [ ] テストでは実際のテスト用 DB にアクセスするインテグレーションテストを書く
- [ ] `pnpm test <spec_file_path>` で対象テストが通ることを確認する
- [ ] `pnpm test` で全テストが通ることを確認する

## Dependencies

- `pnpm test` — テスト実行 (vitest)
- fishery — テストデータファクトリ
- @faker-js/faker — テストデータ生成
- @testing-library/react — コンポーネントテスト
- @testing-library/jest-dom — DOM アサーション

## Notes

- テストは必ず実際に実行して通ることを確認すること
- ファイル種別ごとのテストの書き方は `.claude/rules/*.md` を参照すること
- vitest は Next.js の `"use server"` 制約を検出できない。ランタイムエラーの検出には `pnpm build` が必要
