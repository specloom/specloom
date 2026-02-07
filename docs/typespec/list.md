# List View

List View は一覧画面を定義します。

## 基本

```typespec
@S.view(Post, "list")
model PostList {}
```

## @columns

一覧に表示するカラムを指定します。

```typespec
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
model PostList {}
```

省略すると Resource の全フィールドが表示されます（`@readonly` 含む）。

## @searchable

検索可能なフィールドを指定します。

```typespec
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
@S.searchable(["title", "body"])
model PostList {}
```

## @sortable / @defaultSort

ソート可能なフィールドとデフォルトソートを指定します。

```typespec
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
@S.sortable(["title", "createdAt", "updatedAt"])
@S.defaultSort("createdAt", "desc")
model PostList {}
```

| 引数 | 説明 |
|------|------|
| 第1引数 | フィールド名 |
| 第2引数 | "asc" / "desc" |

## @selection

行選択モードを指定します。JSON では `selectionMode` として出力されます。

```typespec
@S.view(Post, "list")
@S.selection("multi")
model PostList {}
```

| 値 | 説明 |
|-----|------|
| none | 選択不可（default） |
| single | 単一選択 |
| multi | 複数選択 |

> **Note**: TypeSpec では `@selection`、JSON 出力では `selectionMode` になります。

## @clickAction

行クリック時のアクションを指定します。

```typespec
@S.view(Post, "list")
@S.clickAction("show")
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
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
@S.namedFilter("all", "すべて", #{})
@S.namedFilter("published", "公開中", #{ status: "published" })
@S.namedFilter("draft", "下書き", #{ status: "draft" })
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
@S.view(Post, "list")
// 単純な条件
@S.namedFilter("published", "公開中", #{
  field: "status", operator: "eq", value: "published"
})

// AND 条件: 公開中 かつ 最近7日以内
@S.namedFilter("recent_published", "最近の公開記事", #{
  and: [
    { field: "status", operator: "eq", value: "published" },
    { field: "createdAt", operator: "gte", value: "@relative(-7d)" }
  ]
})

// OR 条件: 下書き または レビュー中
@S.namedFilter("unpublished", "未公開", #{
  or: [
    { field: "status", operator: "eq", value: "draft" },
    { field: "status", operator: "eq", value: "review" }
  ]
})

// コンテキスト参照: 自分の記事
@S.namedFilter("my_posts", "自分の記事", #{
  field: "author.id", operator: "eq", value: "@context.user.id"
})

// IN 演算子
@S.namedFilter("active", "アクティブ", #{
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

一覧画面のアクションは3種類あります。

| 種類 | デコレーター | 説明 |
|------|-------------|------|
| Page action | `@action` | 画面上部に表示 |
| Bulk action | `@action` + `@requiresSelection` | 複数選択時に有効 |
| Row action | `@rowAction` | 各行に表示 |

> 推奨: `@rowAction` / `@requiresSelection` を canonical とし、`@placement` は legacy alias として扱います。  
> `@placement("bulk")` を使う場合は `selection: "selected"` が暗黙付与されます。

### Page Actions（画面上部）

```typespec
@S.view(Post, "list")
model PostList {
  @S.action("create")
  @S.label("新規作成")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "plus", variant: "primary" })
  create: never;
}
```

### Bulk Actions（複数選択時）

`@selection("multi")` と組み合わせて使います。

```typespec
@S.view(Post, "list")
@S.selection("multi")
model PostList {
  @S.action("bulkDelete")
  @S.label("一括削除")
  @S.requiresSelection("selected")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("選択した項目を削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;

  @S.action("bulkPublish")
  @S.label("一括公開")
  @S.requiresSelection("selected")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  bulkPublish: never;
}
```

### Row Actions（各行）

```typespec
@S.view(Post, "list")
model PostList {
  @S.rowAction("show")
  @S.label("詳細")
  show: never;

  @S.rowAction("edit")
  @S.label("編集")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "pencil" })
  edit: never;

  @S.rowAction("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

## 完全な例

```typespec
@S.view(Post, "list")
@S.columns(["title", "status", "author", "createdAt"])
@S.searchable(["title", "body"])
@S.sortable(["title", "createdAt", "updatedAt"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
@S.namedFilter("all", "すべて", #{})
@S.namedFilter("published", "公開中", #{ status: "published" })
@S.namedFilter("draft", "下書き", #{ status: "draft" })
model PostList {
  // Page Actions
  @S.action("create")
  @S.label("新規作成")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  // Bulk Actions
  @S.action("bulkDelete")
  @S.label("一括削除")
  @S.requiresSelection("selected")
  @S.allowedWhen("role == 'admin'")
  @S.confirm
  @S.ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;

  // Row Actions
  @S.rowAction("show")
  @S.label("詳細")
  show: never;

  @S.rowAction("edit")
  @S.label("編集")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "pencil" })
  edit: never;

  @S.rowAction("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

## 次のステップ

- [Form View](./form.md) - 作成・編集画面
- [Show View](./show.md) - 詳細画面
- [Action](./action.md) - アクションの詳細
