# @specloom/data-provider

データプロバイダ抽象化レイヤー。REST 実装と認証付き HTTP クライアントを含む。

## Commands

```bash
pnpm build        # tsc
pnpm dev          # tsc --watch
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest
```

## Structure

| Path | Purpose |
|------|---------|
| `src/core/dataProvider.ts` | `DataProvider` インターフェース |
| `src/core/types.ts` | `ListParams`, `ResourceConfig`, `CustomAction` 型 |
| `src/http/httpClient.ts` | `createHttpClient()` — Bearer トークン自動注入、401/403 ハンドリング |
| `src/providers/rest/restDataProvider.ts` | `createRestDataProvider()` — REST 実装 |
| `src/providers/graphql/` | 未実装 (placeholder) |

## Exports

- `.` — コアインターフェース・型・HTTP クライアント
- `./rest` — REST 実装 (`@specloom/data-provider/rest`)

## Design Notes

- `@specloom/auth-provider` に依存しない
- `TokenProvider` インターフェース (`getToken` + optional `checkError(HttpError)`) で認証を抽象化
