# SolidJS Example

`specloom` の SolidJS / SolidStart integration を試すための独立 example です。
spec JSON から管理画面の一覧・詳細・フォームを自動生成するデモサイトです。

この example は root workspace に含めていません。依存関係はこのディレクトリで個別に install するか、ルートの補助 script を使ってください。

## Run

このディレクトリで実行する場合:

```bash
pnpm install
pnpm dev
```

リポジトリルートから実行する場合:

```bash
pnpm example:solidjs:install
pnpm example:solidjs:dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Database (Prisma + SQLite)

SQLite + Prisma でローカル DB を使用しています。

```bash
# マイグレーション適用（初回 or スキーマ変更後）
npx prisma migrate dev

# シードデータ投入
npx prisma db seed

# Prisma Client 再生成
npx prisma generate

# DB の中身を確認
npx prisma studio
```

- DB ファイル: `prisma/dev.db`（.gitignore 済み）
- アダプタ: `@prisma/adapter-libsql`
- クライアント: `src/generated/prisma/`（.gitignore 済み）
- アプリからの利用: `import { prisma } from "~/lib/db"`

## Architecture

```
src/
├── admin/
│   ├── runtime.ts          ← spec JSON 読み込み + SpecloomClient 生成
│   ├── mock-data.ts        ← リソースごとのモックデータ生成
│   └── field-registry.tsx  ← widget → UI コンポーネントのマッピング
├── components/
│   ├── AdminLayout.tsx     ← SpecloomProvider でラップ
│   ├── AppSidebar.tsx      ← spec からカテゴリ別ナビを自動生成
│   └── vm/
│       ├── ResourceListPage.tsx   ← 一覧（ListState + テーブル）
│       ├── ResourceFormPage.tsx   ← 新規作成 / 編集（FormState）
│       ├── ResourceShowPage.tsx   ← 詳細表示（ShowVM）
│       └── SpecValue.tsx          ← フィールド値の表示ユーティリティ
├── lib/
│   └── db.ts               ← Prisma クライアント（シングルトン）
├── routes/
│   ├── index.tsx            ← ダッシュボード（リソース一覧カード）
│   └── resources/
│       └── [resource]/
│           ├── index.tsx    ← 一覧ページ
│           ├── new.tsx      ← 新規作成
│           └── [id]/
│               ├── index.tsx ← 詳細表示
│               └── edit.tsx  ← 編集
└── generated/
    └── prisma/              ← Prisma Client（自動生成）
```

## specloom 連携

- `examples/specs/generated/` の 6 カテゴリ分の spec JSON をマージして使用
- `@specloom/solidjs` の `SpecloomProvider`, `createListStore`, `createFormStore` で状態管理
- 動的ルーティング（`/resources/[resource]/[id]`）で全リソースを汎用的に表示
- ページコンポーネントは `createMemo` ベースのリアクティブストアパターン

## Notes

- `vite: command not found` が出る場合は、この example 配下に `node_modules` がありません
- ルートの `pnpm install` だけでは、この example の依存は入りません
- `package.json` の `engines.node` は `>=22` です
- specloom パッケージは `link:` プロトコルで参照（`file:` ではなく）
- `vite.config.ts` の `resolve.alias` で specloom パッケージをソースファイルに直接解決

## solid-ui

`solid-ui` の SolidStart 導入手順で前提にされる準備のうち、次はこの example 側で揃っています。

- `src/app.css`
- `tailwind.config.cjs`
- `~/*` alias in `tsconfig.json`
- `@fontsource/inter`

次はこのディレクトリでそのまま進められます。

```bash
pnpm install --ignore-workspace
npx solidui-cli@latest init
npx solidui-cli@latest add card -o
```

不足している UI component がある場合は、同じ形式で追加してください。

```bash
npx solidui-cli@latest add <component> -o
```
