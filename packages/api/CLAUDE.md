# @specloom/api

TypeSpec で定義された OpenAPI スペック。

## Commands

```bash
pnpm build        # tsp compile .
pnpm dev          # tsp compile . --watch
pnpm typecheck    # tsp compile . --no-emit
```

## Structure

| Path | Purpose |
|------|---------|
| `src/main.tsp` | エントリポイント |
| `src/endpoints.tsp` | API エンドポイント定義 |
| `src/response.tsp` | レスポンス型 |
| `src/error.tsp` | エラー型 |
| `src/view_model.tsp` | ViewModel 型 |
| `src/common.tsp` | 共通型 |

## Output

- `dist/openapi.json` — 生成された OpenAPI スペック

## Dependencies

- peerDependency: `@typespec/compiler` (>=0.60.0)
- devDependencies: `@typespec/http`, `@typespec/openapi`, `@typespec/openapi3`
