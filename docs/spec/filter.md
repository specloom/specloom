# Filter Spec

高度なフィルタリング/検索クエリの仕様です。

> **Note**: namedFilter の `filter` プロパティや API クエリパラメータで使用します。

## 設計思想

### specloom が定義するもの

- **フィルター可能なフィールド**: `@filterable` デコレーター
- **演算子**: フィールドタイプに応じた使用可能な演算子
- **namedFilter**: 定義済みフィルター（UIで「タブ」や「プリセット」として表示）

### specloom が定義しないもの

- **実際のクエリ実行**: バックエンド/データベースの責務
- **クエリ構文の実装**: ORM/Query Builder の責務
- **UI での表現**: UI フレームワークの責務

## 基本構造

```json
{
  "and": [
    { "field": "status", "op": "eq", "value": "published" },
    { "field": "createdAt", "op": "gte", "value": "2024-01-01" }
  ]
}
```

### FilterExpression

```typescript
type FilterExpression =
  | FilterCondition       // 単一条件
  | { and: FilterExpression[] }  // AND 結合
  | { or: FilterExpression[] }   // OR 結合
  | { not: FilterExpression };   // NOT（否定）
```

### FilterCondition

```typescript
interface FilterCondition {
  field: string;      // フィールドパス（例: "status", "author.name"）
  op: FilterOperator; // 演算子
  value: unknown;     // 比較値
}
```

## 演算子一覧

### 比較演算子

| 演算子 | 説明 | 使用可能な型 |
|--------|------|-------------|
| `eq` | 等しい | すべて |
| `ne` | 等しくない | すべて |
| `gt` | より大きい | number, date, datetime |
| `gte` | 以上 | number, date, datetime |
| `lt` | より小さい | number, date, datetime |
| `lte` | 以下 | number, date, datetime |

### 文字列演算子

| 演算子 | 説明 | 使用可能な型 |
|--------|------|-------------|
| `contains` | 部分一致 | string |
| `startsWith` | 前方一致 | string |
| `endsWith` | 後方一致 | string |
| `matches` | 正規表現マッチ | string |

### 集合演算子

| 演算子 | 説明 | 使用可能な型 |
|--------|------|-------------|
| `in` | いずれかに一致 | すべて（value は配列） |
| `notIn` | いずれにも一致しない | すべて（value は配列） |

### 存在演算子

| 演算子 | 説明 | 使用可能な型 |
|--------|------|-------------|
| `isNull` | null である | すべて（value は true/false） |
| `isEmpty` | 空である | string, array |

### 配列演算子

| 演算子 | 説明 | 使用可能な型 |
|--------|------|-------------|
| `hasAny` | いずれかを含む | array |
| `hasAll` | すべてを含む | array |
| `hasNone` | いずれも含まない | array |

## 使用例

### 単純なフィルター

```json
{ "field": "status", "op": "eq", "value": "published" }
```

### AND 条件

```json
{
  "and": [
    { "field": "status", "op": "eq", "value": "published" },
    { "field": "createdAt", "op": "gte", "value": "2024-01-01" }
  ]
}
```

### OR 条件

```json
{
  "or": [
    { "field": "status", "op": "eq", "value": "draft" },
    { "field": "status", "op": "eq", "value": "review" }
  ]
}
```

### NOT 条件

```json
{
  "not": { "field": "status", "op": "eq", "value": "archived" }
}
```

### 複合条件

「公開中」かつ（「カテゴリがニュース」または「注目記事」）

```json
{
  "and": [
    { "field": "status", "op": "eq", "value": "published" },
    {
      "or": [
        { "field": "category", "op": "eq", "value": "news" },
        { "field": "featured", "op": "eq", "value": true }
      ]
    }
  ]
}
```

### IN 演算子

```json
{ "field": "status", "op": "in", "value": ["draft", "review", "published"] }
```

### リレーションフィルター

```json
{ "field": "author.role", "op": "eq", "value": "admin" }
```

ドット記法でリレーション先のフィールドを参照します。

### 配列フィールドのフィルター

```json
{ "field": "tags", "op": "hasAny", "value": ["tech", "news"] }
```

## TypeSpec での定義

### @filterable

フィールドをフィルター可能にします。

```typespec
@resource("Post")
model Post {
  @filterable
  status: Status;
  
  @filterable
  @filterable.operators(["eq", "contains", "startsWith"])
  title: string;
  
  @filterable
  @filterable.operators(["gte", "lte", "eq"])
  createdAt: utcDateTime;
  
  @filterable
  author: User;
}
```

### namedFilter の高度な定義

```typespec
@view(Post, "list")
@namedFilter("recent_published", "最近の公開記事", #{
  and: [
    { field: "status", op: "eq", value: "published" },
    { field: "createdAt", op: "gte", value: "@relative(-7d)" }
  ]
})
@namedFilter("my_drafts", "自分の下書き", #{
  and: [
    { field: "status", op: "eq", value: "draft" },
    { field: "author.id", op: "eq", value: "@context.user.id" }
  ]
})
model PostList {}
```

### 相対日付

`@relative()` 関数で相対的な日付を指定できます。

| 式 | 説明 |
|----|------|
| `@relative(-7d)` | 7日前 |
| `@relative(-1m)` | 1ヶ月前 |
| `@relative(-1y)` | 1年前 |
| `@relative(+7d)` | 7日後 |
| `@relative(startOfDay)` | 今日の開始 |
| `@relative(startOfMonth)` | 今月の開始 |

### コンテキスト参照

`@context.*` でランタイムコンテキストを参照できます。

| 式 | 説明 |
|----|------|
| `@context.user.id` | 現在のユーザー ID |
| `@context.role` | 現在のロール |
| `@context.custom.*` | カスタムコンテキスト |

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "FilterExpression": {
      "oneOf": [
        { "$ref": "#/definitions/FilterCondition" },
        { "$ref": "#/definitions/AndExpression" },
        { "$ref": "#/definitions/OrExpression" },
        { "$ref": "#/definitions/NotExpression" }
      ]
    },
    "FilterCondition": {
      "type": "object",
      "required": ["field", "op", "value"],
      "properties": {
        "field": { "type": "string" },
        "op": {
          "type": "string",
          "enum": [
            "eq", "ne", "gt", "gte", "lt", "lte",
            "contains", "startsWith", "endsWith", "matches",
            "in", "notIn",
            "isNull", "isEmpty",
            "hasAny", "hasAll", "hasNone"
          ]
        },
        "value": {}
      }
    },
    "AndExpression": {
      "type": "object",
      "required": ["and"],
      "properties": {
        "and": {
          "type": "array",
          "items": { "$ref": "#/definitions/FilterExpression" }
        }
      }
    },
    "OrExpression": {
      "type": "object",
      "required": ["or"],
      "properties": {
        "or": {
          "type": "array",
          "items": { "$ref": "#/definitions/FilterExpression" }
        }
      }
    },
    "NotExpression": {
      "type": "object",
      "required": ["not"],
      "properties": {
        "not": { "$ref": "#/definitions/FilterExpression" }
      }
    }
  }
}
```

## API でのクエリ

### クエリパラメータ形式

```
GET /api/posts?filter={"and":[{"field":"status","op":"eq","value":"published"}]}
```

URL エンコードが必要です。

### POST ボディ形式

複雑なクエリは POST で送信できます。

```
POST /api/posts/query
Content-Type: application/json

{
  "filter": {
    "and": [
      { "field": "status", "op": "eq", "value": "published" },
      { "field": "createdAt", "op": "gte", "value": "2024-01-01" }
    ]
  },
  "sort": { "field": "createdAt", "order": "desc" },
  "page": 1,
  "perPage": 20
}
```

## 実装ガイド

### バックエンド実装例

```typescript
// フィルター式を ORM クエリに変換
function buildQuery(filter: FilterExpression, qb: QueryBuilder): QueryBuilder {
  if ('and' in filter) {
    return filter.and.reduce((q, expr) => buildQuery(expr, q), qb);
  }
  if ('or' in filter) {
    return qb.where(orBuilder => {
      filter.or.forEach(expr => orBuilder.orWhere(/* ... */));
    });
  }
  if ('not' in filter) {
    return qb.whereNot(/* ... */);
  }
  
  // FilterCondition
  const { field, op, value } = filter;
  switch (op) {
    case 'eq': return qb.where(field, '=', value);
    case 'ne': return qb.where(field, '!=', value);
    case 'gt': return qb.where(field, '>', value);
    case 'contains': return qb.where(field, 'like', `%${value}%`);
    case 'in': return qb.whereIn(field, value);
    // ...
  }
}
```

## 関連ドキュメント

- [List View](../typespec/list.md) - namedFilter の定義
- [API Spec](./api.md) - API でのフィルター使用
- [ViewModel Spec](./view_model.md) - フィルター状態の ViewModel 表現
