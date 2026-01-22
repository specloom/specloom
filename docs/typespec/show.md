# Show View

Show View は詳細画面を定義します。

## 基本

```typespec
@view(Post, "show")
model PostShow {}
```

## @fields

表示するフィールドを指定します。

```typespec
@view(Post, "show")
@fields(["title", "body", "status", "author", "tags", "createdAt", "updatedAt"])
model PostShow {}
```

省略すると Resource の全フィールドが表示されます。

## フィールドの順序

`@fields` の配列順が表示順になります。

## Relation フィールド

Relation フィールドは Resource の `@ui({ hint })` で表示方法が決まります。

```typespec
@resource
model Post {
  @label("著者")
  @kind("relation")
  @relation(User, #{ labelField: "name" })
  @ui(#{ hint: "avatar", link: true })
  author: User;

  @label("タグ")
  @kind("relation")
  @relation(Tag, #{ labelField: "name" })
  @ui(#{ hint: "badge" })
  tags: Tag[];
}
```

- `hint: "avatar"` → アバター表示
- `hint: "badge"` → バッジ表示
- `link: true` → クリックで詳細画面へ

## Actions

```typespec
@view(Post, "show")
@fields(["title", "body", "status", "author", "tags", "createdAt", "updatedAt"])
model PostShow {
  @action("edit")
  @label("編集")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

## 状態遷移アクション

レコードの状態に応じたアクションを定義できます。

```typespec
@view(Post, "show")
model PostShow {
  @action("publish")
  @label("公開")
  @allowedWhen("status == 'draft'")
  @ui(#{ icon: "globe", variant: "primary" })
  publish: never;

  @action("unpublish")
  @label("非公開")
  @allowedWhen("status == 'published'")
  unpublish: never;

  @action("archive")
  @label("アーカイブ")
  @allowedWhen("status == 'published'")
  @confirm("アーカイブしますか？")
  archive: never;
}
```

## 完全な例

```typespec
@view(Post, "show")
@fields(["title", "body", "status", "author", "tags", "createdAt", "updatedAt"])
model PostShow {
  // 基本アクション
  @action("edit")
  @label("編集")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;

  // 状態遷移
  @action("publish")
  @label("公開")
  @allowedWhen("status == 'draft'")
  @ui(#{ icon: "globe", variant: "primary" })
  publish: never;

  @action("archive")
  @label("アーカイブ")
  @allowedWhen("status == 'published'")
  @confirm
  archive: never;
}
```

## 次のステップ

- [Action](./action.md) - アクションの詳細
- [Examples](./examples.md) - 完全な例
