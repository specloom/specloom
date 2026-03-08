# SolidJS Example

`specloom` の SolidJS / SolidStart integration を試すための独立 example です。

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

## Notes

- `vite: command not found` が出る場合は、この example 配下に `node_modules` がありません
- ルートの `pnpm install` だけでは、この example の依存は入りません
- `package.json` の `engines.node` は `>=22` です

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
