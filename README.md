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

### spec（定義）
```typespec
@resource
@label("投稿")
model Post {
  @kind("text")
  @label("タイトル")
  @required
  title: string;

  @kind("status")
  @label("状態")
  @hint("badge")
  status: "draft" | "published";
}

@action("delete")
@placement("row")
@allowedWhen("role == 'admin'")
model DeletePost {}
```

### ViewModel（API が返す）
```json
{
  "resource": "Post",
  "fields": [
    { "name": "title", "kind": "text", "label": "タイトル" },
    { "name": "status", "kind": "status", "label": "状態", "hint": "badge" }
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

## Packages (coming soon)

| Package | Description |
|---------|-------------|
| @specloom/core | spec + VM 型定義 |
| @specloom/typespec | TypeSpec デコレータ |
| @specloom/builder | VM ビルダー |
| @specloom/loader | spec ローダー |

## Status

🚧 **Under Development**

- [ ] spec v0.1
- [ ] @specloom/core
- [ ] @specloom/typespec
- [ ] @specloom/builder
- [ ] Examples

## License

MIT
