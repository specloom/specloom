# Spec v1 Status

このドキュメントは draft ではなく、現行 v1 の設計メモとして扱います。

## Adopted Decisions

- authoring DSL は TypeSpec を使う
- runtime は compiled JSON を読む
- UI library は core に同梱しない
- TypeSpec 側は `using Specloom;`
- resource 定義は `@entity`
- list 設定は `@index`
- cross-field rule は `@rule`
- action は `@pageAction` / `@rowAction`
- 標準 validation は TypeSpec built-in を優先する
  `@minValue`, `@maxValue`, `@minLength`, `@maxLength`, `@pattern`, `@minItems`, `@maxItems`

## Runtime Surface

現行 v1 runtime で主に使う API:

- `createFormState`
- `createInputState`
- `createListState`
- `validateForm`
- `normalizeInputValue`
- `createOptionsResolver`
- `evaluateFilter`
- `formatValue`
- `buildActionRequest`
- `createUiResolver`
