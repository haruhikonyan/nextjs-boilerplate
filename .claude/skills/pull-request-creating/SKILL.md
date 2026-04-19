---
name: pull-request-creating
description: gh コマンドを利用して PR を作成するスキル
---

# PR 作成スキル

実装完了後に `gh` コマンドを使って Pull Request を作成するスキル。

## When to use

- 実装・リファクタリングが完了したとき
- テストが通っていることを確認した後

## Checklist / Instructions

- [ ] `pnpm test` でテストが全て通ることを確認する
- [ ] `pnpm lint` でコードに違反がないことを確認する
- [ ] `git diff <base branch>` で変更内容を確認する
- [ ] `gh pr create` で PR を作成する
  - タイトル: 実装内容を簡潔に表す
    - issue が明示的に渡されていれば issue のタイトルを利用する
  - 本文: 計画と実装内容を記載（下記テンプレートを参照）
- [ ] PR の URL をユーザーに共有し、特に確認してほしい箇所を伝える

## PR テンプレート

```markdown
## 概要
<!-- 何を実装・修正したかを説明する -->

## 実装内容
<!-- 変更したファイルと変更内容を記載する -->

## 確認してほしい点
<!-- レビュアーに特に確認してほしい部分を記載する -->
```

## Dependencies

- `gh` コマンド（GitHub CLI）
- `pnpm test` — テスト実行 (vitest)
- `pnpm lint` — lint チェック (biome)

## Notes

- PR の本文には実装計画の内容と実際に実装した内容を記載する
- issue がある場合は `Closes #<issue番号>` を本文に含める
