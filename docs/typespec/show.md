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
model PostShow {
  @S.action("edit")
  @S.label("編集")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "pencil" })
  edit: never;

  @S.action("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

## 状態遷移アクション

レコードの状態に応じたアクションを定義できます。

```typespec
@S.view(Post, "show")
model PostShow {
  @S.action("publish")
  @S.label("公開")
  @S.allowedWhen("status == 'draft'")
  @S.ui(#{ icon: "globe", variant: "primary" })
  publish: never;

  @S.action("unpublish")
  @S.label("非公開")
  @S.allowedWhen("status == 'published'")
  unpublish: never;

  @S.action("archive")
  @S.label("アーカイブ")
  @S.allowedWhen("status == 'published'")
  @S.confirm("アーカイブしますか？")
  archive: never;
}
```

## 完全な例

```typespec
@S.view(Post, "show")
@S.fields(["title", "body", "status", "author", "tags", "createdAt", "updatedAt"])
model PostShow {
  // 基本アクション
  @S.action("edit")
  @S.label("編集")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "pencil" })
  edit: never;

  @S.action("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;

  // 状態遷移
  @S.action("publish")
  @S.label("公開")
  @S.allowedWhen("status == 'draft'")
  @S.ui(#{ icon: "globe", variant: "primary" })
  publish: never;

  @S.action("archive")
  @S.label("アーカイブ")
  @S.allowedWhen("status == 'published'")
  @S.confirm
  archive: never;
}
```

## 次のステップ

- [Action](./action.md) - アクションの詳細
- [Examples](./examples.md) - 完全な例
