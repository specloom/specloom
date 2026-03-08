# SolidJS Guides

SolidJS / SolidStart で `specloom` を使うためのガイドです。

## Guides

- [Runtime Integration](./runtime.md)
  `validateSpec`, `createFormState`, `createListState`, `createUiResolver`, `createOptionsResolver` を Solid の signal / memo に接続する方法
- [Providers Guide](../solid-integration.md)
  `@specloom/auth-provider` と `@specloom/data-provider` を AuthContext / DataContext / AuthGuard に統合する方法

## 設計方針

- `specloom` は component を持ちません
- Solid 側では signal で state helper を保持し、`view()` を `createMemo()` で読む構成にします
- renderer key は `createUiResolver()` の返り値を使って registry に解決します
- API 通信や認証は `@specloom/data-provider` / `@specloom/auth-provider` に切り出します
