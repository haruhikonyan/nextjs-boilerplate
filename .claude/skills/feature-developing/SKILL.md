---
name: feature-developing
description: 新しい機能を実装するスキル
---

# 機能実装スキル

承認済みの実装計画に基づいて機能を実装し、テストも合わせて書くスキル。

## When to use

- `implementation-planning` スキルで計画が承認された後
- ページ・コンポーネント・Server Actions の追加・修正をするとき

## Checklist / Instructions

- [ ] 承認済みの実装計画を確認する
- [ ] `feature/` から始まるブランチを作成する（issue がある場合は `feature/<issue番号>-<説明>` 形式）
- [ ] 実装計画に沿って実装する
- [ ] 編集した各ファイルに対してテストを書く（`test-creating` スキルを参照）
- [ ] `pnpm biome check --fix` で lint エラーを修正する
- [ ] `pnpm test` でテストが通ることを確認する
- [ ] `pnpm build` で Next.js ビルドが通ることを確認する（`"use server"` 制約など vitest では検出できないエラーを検知）

## Dependencies

- `pnpm test` — テスト実行 (vitest)
- `pnpm lint` — lint チェック (biome)
- `pnpm biome check --fix` — 自動修正
- `pnpm build` — Next.js ビルド検証
- test-creating スキル

## Notes

- ファイル種別ごとの書き方は `.claude/rules/*.md` を参照すること
- vitest は Next.js の `"use server"` 制約を検出できないため、`pnpm build` で必ず検証する
