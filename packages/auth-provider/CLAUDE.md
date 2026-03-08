# @specloom/auth-provider

認証プロバイダ抽象化レイヤー。Firebase Identity Platform のマルチテナント実装を含む。

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
| `src/core/authProvider.ts` | `AuthProvider<TTenant>` インターフェース |
| `src/core/types.ts` | `AuthIdentity`, `LoginParams`, `SignInMethod` 型 |
| `src/providers/firebase/` | `createFirebaseAuthProvider()` 実装 |
| `src/providers/supabase/` | 未実装 (placeholder) |

## Exports

- `.` — コアインターフェース・型
- `./firebase` — Firebase 実装 (`@specloom/auth-provider/firebase`)

## Dependencies

- peerDependency: `firebase` (^11.0.0, optional)
