# Filter Spec

高度なフィルタリング/検索クエリの仕様です。

## 概要

specloom では TypeSpec でフィルターを定義します：

1. **@filter** - フィールドをフィルター可能にする
2. **@namedFilter** - 定義済みフィルターを作成する

## @filter

フィールドをフィルター可能にします。

```typespec
@resource
model Post {
  @filter
  status: Status;
  
  @filter(["eq", "contains", "starts_with"])
  title: string;
  
  @filter(["gte", "lte", "eq"])
  createdAt: utcDateTime;
  
  @filter
  author: User;
}
```

### 演算子を制限

```typespec
// すべての演算子を許可（デフォルト）
@filter
status: string;

// 特定の演算子のみ許可
@filter(["eq", "ne", "in"])
status: string;
```

## @namedFilter

定義済みフィルターを作成します。UI では「タブ」「ドロップダウン」など自由に表現できます。

### 基本

```typespec
@view(Post, "list")
@namedFilter("all", "すべて", #{})
@namedFilter("published", "公開中", #{ field: "status", operator: "eq", value: "published" })
@namedFilter("draft", "下書き", #{ field: "status", operator: "eq", value: "draft" })
model PostList {}
```

### AND 条件

```typespec
@namedFilter("recent_published", "最近の公開記事", #{
  and: [
    { field: "status", operator: "eq", value: "published" },
    { field: "createdAt", operator: "gte", value: "@relative(-7d)" }
  ]
})
```

### OR 条件

```typespec
@namedFilter("unpublished", "未公開", #{
  or: [
    { field: "status", operator: "eq", value: "draft" },
    { field: "status", operator: "eq", value: "review" }
  ]
})
```

### NOT 条件

```typespec
@namedFilter("active", "アクティブ", #{
  not: { field: "status", operator: "eq", value: "archived" }
})
```

### 複合条件

```typespec
// 公開中 かつ (ニュース または 注目記事)
@namedFilter("featured_news", "注目ニュース", #{
  and: [
    { field: "status", operator: "eq", value: "published" },
    {
      or: [
        { field: "category", operator: "eq", value: "news" },
        { field: "featured", operator: "eq", value: true }
      ]
    }
  ]
})
```

### コンテキスト参照

```typespec
// 自分の記事
@namedFilter("my_posts", "自分の記事", #{
  field: "author.id", operator: "eq", value: "@context.user.id"
})

// 自分の下書き
@namedFilter("my_drafts", "自分の下書き", #{
  and: [
    { field: "status", operator: "eq", value: "draft" },
    { field: "author.id", operator: "eq", value: "@context.user.id" }
  ]
})
```

### リレーションフィルター

ドット記法でリレーション先のフィールドを参照：

```typespec
@namedFilter("admin_posts", "管理者の記事", #{
  field: "author.role", operator: "eq", value: "admin"
})
```

## 演算子一覧

| 演算子 | 説明 | 適した型 |
|--------|------|----------|
| `eq` | 等しい | すべて |
| `ne` | 等しくない | すべて |
| `gt`, `gte` | より大きい、以上 | number, date |
| `lt`, `lte` | より小さい、以下 | number, date |
| `in` | いずれかに一致 | すべて |
| `not_in` | いずれにも一致しない | すべて |
| `contains` | 部分一致 | string |
| `ilike` | 部分一致（大文字小文字区別なし） | string |
| `starts_with` | 前方一致 | string |
| `ends_with` | 後方一致 | string |
| `matches` | 正規表現 | string |
| `is_null` | null 判定 | すべて |
| `is_empty` | 空判定 | string, array |
| `has_any` | いずれかを含む | array |
| `has_all` | すべてを含む | array |
| `has_none` | いずれも含まない | array |

## 特殊な値

### 相対日付

```typespec
@namedFilter("recent", "最近", #{
  field: "createdAt", operator: "gte", value: "@relative(-7d)"
})
```

| 式 | 説明 |
|----|------|
| `@relative(-7d)` | 7日前 |
| `@relative(-1m)` | 1ヶ月前 |
| `@relative(-1y)` | 1年前 |
| `@relative(+7d)` | 7日後 |
| `@relative(startOfDay)` | 今日の開始 |
| `@relative(startOfMonth)` | 今月の開始 |

### コンテキスト参照

| 式 | 説明 |
|----|------|
| `@context.user.id` | 現在のユーザー ID |
| `@context.role` | 現在のロール |
| `@context.custom.*` | カスタムコンテキスト |

## コンパイル結果

TypeSpec からコンパイルされる JSON 形式：

```json
{
  "namedFilters": [
    {
      "id": "recent_published",
      "label": "最近の公開記事",
      "filter": {
        "and": [
          { "field": "status", "operator": "eq", "value": "published" },
          { "field": "createdAt", "operator": "gte", "value": "@relative(-7d)" }
        ]
      }
    }
  ]
}
```

この JSON を扱う TypeScript 型は `packages/specloom/src/spec/index.ts` で定義されています。

## 設計方針

### specloom が定義するもの

- フィルター可能なフィールド（`@filter`）
- 定義済みフィルター（`@namedFilter`）
- 演算子とフィルター式の構造

### specloom が定義しないもの

- 実際のクエリ実行（バックエンド/DB の責務）
- UI での表現（フレームワークの責務）

## 関連ドキュメント

- [Field - @filter](../typespec/field.md#filter) - フィールドのフィルター設定
- [List View - @namedFilter](../typespec/list.md#namedfilter) - 一覧画面でのフィルター定義
