# Field

フィールドの種類と表示・入力のヒントを定義します。

## ID フィールド

```typespec
// 文字列 ID（UUID など）
@S.readonly
id: string;

// 数値 ID（auto increment）
@S.readonly
id: int32;
```

ID の生成方法（UUID、auto increment など）は実装側で決めます。

## @kind

フィールドの意味的な種類を指定します。

```typespec
@S.kind("text")
title: string;

@S.kind("longText")
body: string;

@S.kind("enum")
status: string;
```

### 種類一覧

| kind | 説明 | 備考 |
|------|------|------|
| text | 短いテキスト | |
| longText | 長いテキスト | |
| number | 数値 | |
| boolean | 真偽値 | |
| date | 日付 | |
| datetime | 日時 | |
| enum | 列挙型 | `@options` と一緒に使う |
| relation | リレーション | `@relation` と一緒に使う |
| file | ファイル | |
| image | 画像 | |
| password | パスワード | `@ui(#{ inputHint: "password" })` 自動設定 |
| email | メールアドレス | 自動で pattern + inputHint |
| tel | 電話番号 | 自動で pattern + inputHint |
| url | URL | 自動で pattern + inputHint |

省略時は TypeSpec の型から推論します。

### 自動設定される kind

`email`, `tel`, `url`, `password` は自動的に適切な `pattern` と `inputHint` が設定されます。

```typespec
// これだけで OK
@S.kind("email")
email: string;

// 内部的にはこうなる
// pattern: "email"
// inputHint: "email"
```

`image` は `file` の特殊化で、画像プレビューや画像専用アップローダーを示します。

```typespec
@S.kind("image")
@S.ui(#{ inputHint: "file" })
avatar?: string;
```

## @ui

表示と入力のヒントを `@ui` でまとめて指定します。

```typespec
@S.kind("enum")
@S.ui(#{ hint: "badge", inputHint: "select" })
status: string;

@S.kind("relation")
@S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
author: User;
```

### @ui オプション一覧

| オプション | 型 | 対象 | 説明 |
|-----------|-----|------|------|
| hint | string | Field | 表示ヒント（badge, avatar, progress） |
| inputHint | string | Field | 入力ヒント（select, autocomplete, richtext） |
| format | string | Field | 表示フォーマット（currency, relative） |
| link | boolean | Field | クリック可能にする |
| icon | string | Field/Action | アイコン（plus, trash, pencil） |
| variant | string | Field/Action | 種類（primary, danger, warning） |

```typespec
// Field
@S.kind("number")
@S.ui(#{ format: "currency" })
price: int32;

@S.kind("enum")
@S.ui(#{ hint: "badge" })
status: string;

@S.kind("relation")
@S.relation(User, #{ labelField: "name", searchable: true })
@S.ui(#{ hint: "avatar", link: true })
author: User;

// Action
@S.action("delete")
@S.ui(#{ icon: "trash", variant: "danger" })
delete: never;
```

### Legacy aliases

`@hint("...")` と `@inputHint("...")` も使えますが、**新規定義では `@ui(#{ ... })` を推奨**します。

### format 一覧

| format | 説明 | 例 |
|--------|------|-----|
| currency | 通貨 | ¥1,000 |
| percent | パーセント | 50% |
| decimal | 小数 | 1,234.56 |
| bytes | バイト | 1.5 MB |
| date | 日付 | 2024/01/01 |
| datetime | 日時 | 2024/01/01 12:00 |
| relative | 相対時間 | 3日前 |
| duration | 時間 | 2時間30分 |

### hint 一覧

| hint | 説明 | 適した kind |
|------|------|------------|
| badge | バッジ表示 | status |
| avatar | アバター表示 | relation |
| link | リンク表示 | url, email |
| code | コード表示 | text |
| color | 色付き表示 | status |
| progress | 進捗バー | number |

### inputHint 一覧

| inputHint | 説明 | 適した kind |
|-----------|------|------------|
| text | 1行テキスト | text, email, url |
| multiline | 複数行テキスト | longText |
| richtext | リッチテキスト | longText |
| markdown | Markdown | longText |
| number | 数値入力 | number |
| checkbox | チェックボックス | boolean |
| switch | スイッチ | boolean |
| select | ドロップダウン | status |
| radio | ラジオボタン | status |
| autocomplete | 検索付き選択 | relation, status |
| modal | モーダル選択 | relation |
| date | 日付ピッカー | date |
| datetime | 日時ピッカー | datetime |
| color | カラーピッカー | text |
| file | ファイル選択 | file, image |
| password | パスワード入力 | text |

## @options

選択肢を定義します。`@kind("enum")` と一緒に使います。

```typespec
@S.kind("enum")
@S.ui(#{ hint: "badge", inputHint: "select" })
@S.options(#[
  #{ value: "draft", label: "下書き" },
  #{ value: "published", label: "公開中" },
  #{ value: "archived", label: "アーカイブ" }
])
status: string;
```

## @readonly

読み取り専用にします。フォームに表示されません。

```typespec
@S.readonly
id: string;

@S.readonly
createdAt: utcDateTime;
```

## @computed

DB にない計算フィールドを定義します。サーバーが値を計算します。

```typespec
@S.resource
model User {
  @S.label("姓")
  lastName: string;

  @S.label("名")
  firstName: string;

  @S.label("氏名")
  @S.computed
  fullName: string;
}
```

```typespec
@S.resource
model Order {
  @S.label("単価")
  unitPrice: int32;

  @S.label("数量")
  quantity: int32;

  @S.label("合計")
  @S.computed
  @S.ui(#{ format: "currency" })
  total: int32;
}
```

### 特徴

| 項目 | 説明 |
|------|------|
| DB | 存在しない |
| Form | 自動的に除外 |
| List / Show | 表示可能 |
| 計算ロジック | サーバーの責務 |

### @readonly との違い

| デコレータ | DB | 編集 |
|-----------|-----|------|
| @readonly | ある | 不可 |
| @computed | ない | 不可 |

## @createOnly

作成時のみ編集可能にしたいフィールドに使います。

```typespec
@S.label("初期パスワード")
@S.createOnly
password: string;
```

- create モード: 通常入力可能
- edit モード: ViewModel で `readonly: true` として評価

## @visibleWhen

条件付きでフィールドの表示/非表示を制御します。`@allowedWhen` と同じ式言語を使います。

```typespec
@S.label("公開日")
@S.kind("date")
@S.visibleWhen("status == 'published'")
publishedAt?: plainDate;

@S.label("カテゴリ")
@S.visibleWhen("type == 'article'")
category: string;
```

- 式が `true` → ViewModel で `visible: true`
- 式が `false` → ViewModel で `visible: false`
- 未指定 → ViewModel で `visible: undefined`（常時表示）

UI は `visible` を見て表示/非表示を切り替えるだけ。条件ロジックを持ちません。

## @requiredWhen

条件付きでフィールドを必須化します。

```typespec
@S.label("URL")
@S.kind("url")
@S.requiredWhen("type == 'external'")
url: string;

@S.label("公開日")
@S.kind("date")
@S.requiredWhen("status == 'published'")
publishedAt?: plainDate;
```

- 式が `true` → ViewModel で `required: true`
- 式が `false` → `@required` がなければ `required: false`
- `@required` と `@requiredWhen` は **OR** で結合されます

```typespec
// required: true が常に優先される
@S.required
@S.requiredWhen("status == 'published'")
title: string;  // → 常に required: true
```

## @label

フィールドの表示名を設定します。

```typespec
@S.label("タイトル")
title: string;
```

省略するとフィールド名がそのまま使われます。

## @filter

フィールドをフィルター可能にします。

```typespec
@S.filter
status: string;

@S.filter
createdAt: utcDateTime;

@S.filter
author: User;
```

### 使用可能な演算子を制限

```typespec
// すべての演算子を許可（デフォルト）
@S.filter
status: string;

// 特定の演算子のみ許可
@S.filter(["eq", "ne", "in"])
status: string;

// 文字列検索を許可
@S.filter(["eq", "contains", "starts_with"])
title: string;

// 範囲検索を許可
@S.filter(["eq", "gte", "lte"])
createdAt: utcDateTime;
```

### 演算子一覧

| 演算子 | 説明 | 適した型 |
|--------|------|----------|
| `eq` | 等しい | すべて |
| `ne` | 等しくない | すべて |
| `gt`, `gte` | より大きい、以上 | number, date |
| `lt`, `lte` | より小さい、以下 | number, date |
| `in`, `not_in` | いずれかに一致 | すべて |
| `contains` | 部分一致 | string |
| `starts_with` | 前方一致 | string |
| `ends_with` | 後方一致 | string |
| `is_null` | null 判定 | すべて |
| `has_any`, `has_all` | 配列に含む | array |

詳細は [Filter Spec](../spec/filter.md) を参照。

### リレーションのフィルター

リレーションフィールドに `@filter` を付けると、関連先のフィールドでフィルターできます。

```typespec
@S.filter
author: User;
```

使用例（namedFilter や API クエリで）:
```json
{ "field": "author.id", "operator": "eq", "value": "user-1" }
{ "field": "author.role", "operator": "eq", "value": "admin" }
```

## 例

```typespec
@S.resource
@S.label("投稿")
model Post {
  @S.readonly
  id: string;

  @S.label("タイトル")
  @S.kind("text")
  title: string;

  @S.label("本文")
  @S.kind("longText")
  @S.ui(#{ inputHint: "richtext" })
  body: string;

  @S.label("状態")
  @S.kind("enum")
  @S.ui(#{ hint: "badge", inputHint: "select" })
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;

  @S.label("著者")
  @S.kind("relation")
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @S.relation(User, #{ labelField: "name", searchable: true })
  @S.required
  author: User;

  @S.label("公開日")
  @S.kind("date")
  publishedAt?: plainDate;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  createdAt: utcDateTime;
}
```

## 次のステップ

- [Validation](./validation.md) - バリデーション
- [Relation](./relation.md) - リレーション
