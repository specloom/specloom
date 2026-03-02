# Shop CRUD Example (SolidStart + Solid UI)

specloom の `createAdmin` + ViewModel API を使った Shop CRUD 管理画面のデモ。

## Tech Stack

- **SolidStart** 2.0 (alpha) — SSR + File-based routing
- **Solid UI** (solidui-cli) — shadcn/ui の SolidJS 移植 (Kobalte + Tailwind CSS)
- **Tailwind CSS v4** — `@tailwindcss/vite` プラグイン
- **specloom** — TypeSpec から生成した JSON spec → ViewModel → UI

## セットアップ手順

### 1. 依存インストール

```bash
pnpm install
```

### 2. Solid UI 初期化（実行済み）

```bash
npx solidui-cli@latest init
```

設定ファイル `ui.config.json` が生成される。

### 3. UI コンポーネント追加

```bash
# テーブル・フォーム系
npx solidui-cli@latest add button
npx solidui-cli@latest add badge
npx solidui-cli@latest add table
npx solidui-cli@latest add text-field
npx solidui-cli@latest add textarea
npx solidui-cli@latest add select
npx solidui-cli@latest add switch
npx solidui-cli@latest add label
npx solidui-cli@latest add card
npx solidui-cli@latest add dialog
```

`src/components/ui/` にソースコードとして配置される（npm パッケージではない）。

### 4. 開発サーバー起動

```bash
pnpm dev
```

http://localhost:3000/

## ルート構成

```
src/routes/
├── index.tsx              → /shops リダイレクト
└── shops/
    ├── index.tsx           → 一覧
    ├── [id].tsx            → 詳細
    ├── new.tsx             → 新規作成
    └── [id]/edit.tsx       → 編集
```

## アーキテクチャ

```
TypeSpec (定義)
  → JSON spec (examples/specs/generated/)
    → createAdmin + parseSpec
      → admin.list() → ListVM → 一覧テーブル
      → admin.show() → ShowVM → 詳細画面
      → admin.form() → FormVM → フォーム (新規/編集)
```

- **UI にはパーミッションロジックなし** — VM の `allowed` フラグを読むだけ
- **データはモック** — `src/lib/mock-data.ts` でインメモリ CRUD
- **spec は generated から import** — `src/lib/admin.ts` で JSON spec をマージ

## ファイル構成

| ファイル | 内容 |
|---------|------|
| `vite.config.ts` | Tailwind v4 + SolidStart 設定 |
| `ui.config.json` | Solid UI CLI 設定 |
| `src/app.css` | Tailwind v4 テーマ (CSS 変数) |
| `src/app.tsx` | ルートレイアウト |
| `src/lib/admin.ts` | Admin インスタンス生成 |
| `src/lib/mock-data.ts` | モックデータ + CRUD ヘルパー |
| `src/lib/utils.ts` | `cn()` ユーティリティ (Solid UI) |
| `src/components/ui/` | Solid UI コンポーネント (CLI 生成) |
| `src/components/ShopForm.tsx` | フォーム共通コンポーネント |
| `src/routes/` | ページコンポーネント |

## Tailwind v4 への対応

Solid UI は元々 Tailwind v3 想定だが、v4 で動作確認済み：

- `tailwind.config.cjs` → 不要（削除済み）
- `@tailwind` directives → `@import "tailwindcss"` + `@theme inline`
- PostCSS → 不要（`@tailwindcss/vite` プラグイン使用）
- CSS 変数は `@theme inline` ブロックで Tailwind に認識させる
