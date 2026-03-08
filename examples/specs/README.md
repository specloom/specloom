# TypeSpec Catalog

`examples/specs` は `@specloom/typespec` の catalog 用ディレクトリです。

各 `.tsp` は内部実装パスではなく、正規の package import で `@specloom/typespec` を参照します。

## Layout

```text
examples/specs/
├── entries/
├── catalog/
└── generated/
```

- `catalog/`
  機能別に分割した TypeSpec catalog
- `entries/`
  compile 単位の入口
- `generated/`
  entry ごとの compile 結果の出力先

## Catalog Areas

- `10-basic`
- `20-validation`
- `30-filters-options`
- `40-relations`
- `50-nested`
- `60-actions`

## Compile Policy

- 個別確認は `entries/NN-*.tsp` を compile する
- 出力は 1 つにまとめず、entry ごとに `generated/NN-*/spec.json` へ書き出す
- `all.tsp` のような集約 entry は使わない

## Install

```bash
cd /Volumes/SSD/projects/specloom/examples/specs
pnpm install --ignore-workspace
```

## Compile

個別 entry を compile します。

```bash
pnpm compile:basic
pnpm compile:validation
pnpm compile:filters-options
pnpm compile:relations
pnpm compile:nested
pnpm compile:actions
```

生成されるファイル:

- `generated/10-basic/spec.json`
- `generated/20-validation/spec.json`
- `generated/30-filters-options/spec.json`
- `generated/40-relations/spec.json`
- `generated/50-nested/spec.json`
- `generated/60-actions/spec.json`
