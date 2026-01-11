# specloom

Headless Admin ViewModel Spec

## What is specloom?

specloom は管理画面の「意味」を定義する仕様（spec）と、それを評価して ViewModel を生成するライブラリです。

- **Headless**: UI を含まない。React / Solid / Vue どれでも使える
- **Spec-driven**: TypeSpec で画面の意味を定義
- **ViewModel**: 評価済みの結果を返す。UI は描画するだけ

## Why?

管理画面の課題：

- 権限ロジックが UI に散らばる
- フロントエンドが肥大化する
- UI フレームワークに縛られる

specloom の答え：

- **spec** で意味を定義
- **VM** で評価済みの結果を返す
- **UI** は描画するだけ

## How it works

```
TypeSpec (定義)
    ↓
JSON spec (仕様)
    ↓ + context (user, role)
ViewModel (評価済み)
    ↓
UI (描画するだけ)
```

## Quick Example

### TypeSpec で定義

```typespec
import "@specloom/typespec";

using Specloom;

@resource
@label("投稿")
model Post {
  @readonly
  id: string;

  @label("タイトル")
  @kind("text")
  @required
  title: string;

  @label("状態")
  @kind("enum")
  @ui(#{ hint: "badge", inputHint: "select" })
  @options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;
}

@view(Post, "list")
@columns(["title", "status"])
model PostList {
  @action("delete")
  @label("削除")
  @placement("row")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

### ViewModel（API が返す）

```json
{
  "resource": "Post",
  "fields": [
    { "name": "title", "kind": "text", "label": "タイトル" },
    { "name": "status", "kind": "status", "label": "状態", "ui": { "hint": "badge" } }
  ],
  "rows": [
    {
      "id": "1",
      "values": { "title": "Hello", "status": "published" },
      "actions": [
        { "id": "delete", "label": "削除", "allowed": false }
      ]
    }
  ]
}
```

### UI（描画するだけ）

```tsx
<For each={vm.rows}>
  {(row) => (
    <tr>
      <td>{row.values.title}</td>
      <td><Badge>{row.values.status}</Badge></td>
      <td>
        <For each={row.actions}>
          {(action) => (
            <button disabled={!action.allowed}>{action.label}</button>
          )}
        </For>
      </td>
    </tr>
  )}
</For>
```

**UI に権限ロジックがない。`allowed` を見るだけ。**

## Documentation

- [TypeSpec Guide](./docs/typespec/README.md) - TypeSpec での定義方法
- [Spec v0.1](./docs/spec/v0.1.md) - JSON 仕様（参考）

## Packages

| Package | Description |
|---------|-------------|
| specloom | spec + VM + builder + loader |
| @specloom/typespec | TypeSpec デコレータ + emitter |

## Status

🚧 **Under Development**

- [x] TypeSpec ドキュメント
- [ ] specloom パッケージ実装
- [ ] @specloom/typespec 実装
- [ ] Examples

## License

MIT
