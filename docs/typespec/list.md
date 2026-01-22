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

定義済みフィルターを作成します。

> **Note**: これは「タブ」ではありません。UI での表現（タブ、ドロップダウン、サイドバー等）は自由です。
> 詳細は [設計思想](../spec/philosophy.md) を参照。

### 基本的な使い方

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

### 高度なフィルター式

AND/OR/NOT や各種演算子を使った複雑な条件も定義できます。

```typespec
@view(Post, "list")
// 単純な条件
@namedFilter("published", "公開中", #{ 
  field: "status", operator: "eq", value: "published" 
})

// AND 条件: 公開中 かつ 最近7日以内
@namedFilter("recent_published", "最近の公開記事", #{
  and: [
    { field: "status", operator: "eq", value: "published" },
    { field: "createdAt", operator: "gte", value: "@relative(-7d)" }
  ]
})

// OR 条件: 下書き または レビュー中
@namedFilter("unpublished", "未公開", #{
  or: [
    { field: "status", operator: "eq", value: "draft" },
    { field: "status", operator: "eq", value: "review" }
  ]
})

// コンテキスト参照: 自分の記事
@namedFilter("my_posts", "自分の記事", #{
  field: "author.id", operator: "eq", value: "@context.user.id"
})

// IN 演算子
@namedFilter("active", "アクティブ", #{
  field: "status", operator: "in", value: ["draft", "review", "published"]
})
model PostList {}
```

### 使用可能な演算子

| 演算子 | 説明 | 例 |
|--------|------|-----|
| `eq` | 等しい | `{ field: "status", operator: "eq", value: "published" }` |
| `ne` | 等しくない | `{ field: "status", operator: "ne", value: "archived" }` |
| `gt`, `gte` | より大きい、以上 | `{ field: "price", operator: "gte", value: 1000 }` |
| `lt`, `lte` | より小さい、以下 | `{ field: "stock", operator: "lt", value: 10 }` |
| `in` | いずれかに一致 | `{ field: "status", operator: "in", value: ["a", "b"] }` |
| `contains` | 部分一致 | `{ field: "title", operator: "contains", value: "React" }` |
| `starts_with` | 前方一致 | `{ field: "code", operator: "starts_with", value: "PRD-" }` |
| `has_any` | 配列がいずれかを含む | `{ field: "tags", operator: "has_any", value: ["tech"] }` |

詳細は [Filter Spec](../spec/filter.md) を参照。

### 相対日付

| 式 | 説明 |
|----|------|
| `@relative(-7d)` | 7日前 |
| `@relative(-1m)` | 1ヶ月前 |
| `@relative(startOfDay)` | 今日の開始 |
| `@relative(startOfMonth)` | 今月の開始 |

### コンテキスト参照

| 式 | 説明 |
|----|------|
| `@context.user.id` | 現在のユーザー ID |
| `@context.role` | 現在のロール |
| `@context.custom.*` | カスタムコンテキスト |

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
