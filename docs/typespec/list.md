# List View

List View は一覧画面を定義します。

## 基本

```typespec
@view(Post, "list")
model PostList {}
```

## @columns

一覧に表示するカラムを指定します。

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
model PostList {}
```

省略すると Resource の全フィールドが表示されます（`@readonly` 含む）。

## @searchable

検索可能なフィールドを指定します。

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
@searchable(["title", "body"])
model PostList {}
```

## @sortable / @defaultSort

ソート可能なフィールドとデフォルトソートを指定します。

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
@sortable(["title", "createdAt", "updatedAt"])
@defaultSort("createdAt", "desc")
model PostList {}
```

| 引数 | 説明 |
|------|------|
| 第1引数 | フィールド名 |
| 第2引数 | "asc" / "desc" |

## @selection

行選択モードを指定します。

```typespec
@view(Post, "list")
@selection("multi")
model PostList {}
```

| 値 | 説明 |
|-----|------|
| none | 選択不可（default） |
| single | 単一選択 |
| multi | 複数選択 |

## @clickAction

行クリック時のアクションを指定します。

```typespec
@view(Post, "list")
@clickAction("show")
model PostList {}
```

| 値 | 説明 |
|-----|------|
| none | 何もしない（default） |
| show | 詳細画面へ |
| edit | 編集画面へ |

## @namedFilter

名前付きフィルター（タブ）を定義します。

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
@namedFilter("all", "すべて", #{})
@namedFilter("published", "公開中", #{ status: "published" })
@namedFilter("draft", "下書き", #{ status: "draft" })
model PostList {}
```

| 引数 | 説明 |
|------|------|
| 第1引数 | ID（一意） |
| 第2引数 | 表示ラベル |
| 第3引数 | フィルター条件 |

## Pagination

ページネーションは spec では定義しません。

- perPage は UI / サーバーで設定
- VM で結果が返される

```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "perPage": 20,
    "totalPages": 5
  }
}
```

## Actions

一覧画面のアクションは `@placement` で配置を指定します。

### Header Actions（画面上部）

```typespec
@view(Post, "list")
model PostList {
  @action("create")
  @label("新規作成")
  @placement("header")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;
}
```

### Row Actions（各行）

```typespec
@view(Post, "list")
model PostList {
  @action("show")
  @label("詳細")
  @placement("row")
  show: never;

  @action("edit")
  @label("編集")
  @placement("row")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @placement("row")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

### Bulk Actions（複数選択時）

`@selection("multi")` と組み合わせて使います。

```typespec
@view(Post, "list")
@selection("multi")
model PostList {
  @action("bulkDelete")
  @label("一括削除")
  @placement("bulk")
  @allowedWhen("role == 'admin'")
  @confirm("選択した項目を削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;

  @action("bulkPublish")
  @label("一括公開")
  @placement("bulk")
  @allowedWhen("role == 'admin' || role == 'editor'")
  bulkPublish: never;
}
```

## 完全な例

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "createdAt"])
@searchable(["title", "body"])
@sortable(["title", "createdAt", "updatedAt"])
@defaultSort("createdAt", "desc")
@selection("multi")
@clickAction("show")
@namedFilter("all", "すべて", #{})
@namedFilter("published", "公開中", #{ status: "published" })
@namedFilter("draft", "下書き", #{ status: "draft" })
model PostList {
  // Header Actions
  @action("create")
  @label("新規作成")
  @placement("header")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  // Row Actions
  @action("show")
  @label("詳細")
  @placement("row")
  show: never;

  @action("edit")
  @label("編集")
  @placement("row")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @placement("row")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;

  // Bulk Actions
  @action("bulkDelete")
  @label("一括削除")
  @placement("bulk")
  @allowedWhen("role == 'admin'")
  @confirm
  @ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;
}
```

## 次のステップ

- [Form View](./form.md) - 作成・編集画面
- [Show View](./show.md) - 詳細画面
- [Action](./action.md) - アクションの詳細
