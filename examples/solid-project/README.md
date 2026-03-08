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
