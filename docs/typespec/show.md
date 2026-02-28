# Show View

Show View は詳細画面を定義します。

## 基本

```typespec
@S.view(Post, "show")
model PostShow {}
```

## @fields

表示するフィールドを指定します。

```typespec
@S.view(Post, "show")
@S.fields(["title", "body", "status", "author", "tags", "createdAt", "updatedAt"])
model PostShow {}
```

省略すると Resource の全フィールドが表示されます。

## フィールドの順序

`@fields` の配列順が表示順になります。

## Relation フィールド

Relation フィールドは Resource の `@ui({ hint })` で表示方法が決まります。

```typespec
@S.resource
model Post {
  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.ui(#{ hint: "avatar", link: true })
  author: User;

  @S.label("タグ")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name" })
  @S.ui(#{ hint: "badge" })
  tags: Tag[];
}
```

- `hint: "avatar"` → アバター表示
- `hint: "badge"` → バッジ表示
- `link: true` → クリックで詳細画面へ

## Actions

```typespec
@S.view(Post, "show")
@S.fields(["title", "body", "status", "author", "tags", "createdAt", "updatedAt"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "本当に削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
model PostShow {}
```

## 状態遷移アクション

レコードの状態に応じたアクションを定義できます。

```typespec
@S.view(Post, "show")
@S.action("publish", #{ label: "公開", allowedWhen: "status == 'draft'", ui: #{ icon: "globe", variant: "primary" } })
@S.action("unpublish", #{ label: "非公開", allowedWhen: "status == 'published'" })
@S.action("archive", #{ label: "アーカイブ", allowedWhen: "status == 'published'", confirm: "アーカイブしますか？" })
model PostShow {}
```

## 完全な例

```typespec
@S.view(Post, "show")
@S.fields(["title", "body", "status", "author", "tags", "createdAt", "updatedAt"])
// 基本アクション
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "本当に削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
// 状態遷移
@S.action("publish", #{ label: "公開", allowedWhen: "status == 'draft'", ui: #{ icon: "globe", variant: "primary" } })
@S.action("archive", #{ label: "アーカイブ", allowedWhen: "status == 'published'", confirm: "アーカイブしますか？" })
model PostShow {}
```

## 次のステップ

- [Action](./action.md) - アクションの詳細
- [Examples](./examples.md) - 完全な例
