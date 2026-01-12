# Field

フィールドの種類と表示・入力のヒントを定義します。

## ID フィールド

```typespec
// 文字列 ID（UUID など）
@readonly
id: string;

// 数値 ID（auto increment）
@readonly
id: int32;
```

ID の生成方法（UUID、auto increment など）は実装側で決めます。

## @kind

フィールドの意味的な種類を指定します。

```typespec
@kind("text")
title: string;

@kind("longText")
body: string;

@kind("enum")
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
| email | メールアドレス | 自動で pattern + inputHint |
| tel | 電話番号 | 自動で pattern + inputHint |
| url | URL | 自動で pattern + inputHint |

省略時は TypeSpec の型から推論します。

### 自動設定される kind

`email`, `tel`, `url` は自動的に適切な `pattern` と `inputHint` が設定されます。

```typespec
// これだけで OK
@kind("email")
email: string;

// 内部的にはこうなる
// pattern: "email"
// inputHint: "email"
```

## @ui

表示と入力のヒントを `@ui` でまとめて指定します。

```typespec
@kind("enum")
@ui(#{ hint: "badge", inputHint: "select" })
status: string;

@kind("relation")
@ui(#{ hint: "avatar", inputHint: "autocomplete" })
author: User;
```

### @ui オプション一覧

| オプション | 型 | 対象 | 説明 |
|-----------|-----|------|------|
| hint | string | Field | 表示ヒント（badge, avatar, progress） |
| inputHint | string | Field | 入力ヒント（select, autocomplete, richtext） |
| format | string | Field | 表示フォーマット（currency, relative） |
| link | boolean | Field | クリック可能にする |
| icon | string | Action | アイコン（plus, trash, pencil） |
| variant | string | Action | 種類（primary, danger, warning） |

```typespec
// Field
@kind("number")
@ui(#{ format: "currency" })
price: int32;

@kind("enum")
@ui(#{ hint: "badge" })
status: string;

@kind("relation")
@relation(User, #{ labelField: "name", searchable: true })
@ui(#{ hint: "avatar", link: true })
author: User;

// Action
@action("delete")
@ui(#{ icon: "trash", variant: "danger" })
delete: never;
```

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
@kind("enum")
@ui(#{ hint: "badge", inputHint: "select" })
@options(#[
  #{ value: "draft", label: "下書き" },
  #{ value: "published", label: "公開中" },
  #{ value: "archived", label: "アーカイブ" }
])
status: string;
```

## @readonly

読み取り専用にします。フォームに表示されません。

```typespec
@readonly
id: string;

@readonly
createdAt: utcDateTime;
```

## @computed

DB にない計算フィールドを定義します。サーバーが値を計算します。

```typespec
@resource
model User {
  @label("姓")
  lastName: string;

  @label("名")
  firstName: string;

  @label("氏名")
  @computed
  fullName: string;
}
```

```typespec
@resource
model Order {
  @label("単価")
  unitPrice: int32;

  @label("数量")
  quantity: int32;

  @label("合計")
  @computed
  @ui(#{ format: "currency" })
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

## @label

フィールドの表示名を設定します。

```typespec
@label("タイトル")
title: string;
```

省略するとフィールド名がそのまま使われます。

## @filter

フィールドをフィルター可能にします。

```typespec
@filter
status: string;

@filter
createdAt: utcDateTime;

@filter
author: User;
```

### 使用可能な演算子を制限

```typespec
// すべての演算子を許可（デフォルト）
@filter
status: string;

// 特定の演算子のみ許可
@filter(["eq", "ne", "in"])
status: string;

// 文字列検索を許可
@filter(["eq", "contains", "startsWith"])
title: string;

// 範囲検索を許可
@filter(["eq", "gte", "lte"])
createdAt: utcDateTime;
```

### 演算子一覧

| 演算子 | 説明 | 適した型 |
|--------|------|----------|
| `eq` | 等しい | すべて |
| `ne` | 等しくない | すべて |
| `gt`, `gte` | より大きい、以上 | number, date |
| `lt`, `lte` | より小さい、以下 | number, date |
| `in`, `notIn` | いずれかに一致 | すべて |
| `contains` | 部分一致 | string |
| `startsWith` | 前方一致 | string |
| `endsWith` | 後方一致 | string |
| `isNull` | null 判定 | すべて |
| `hasAny`, `hasAll` | 配列に含む | array |

詳細は [Filter Spec](../spec/filter.md) を参照。

### リレーションのフィルター

リレーションフィールドに `@filter` を付けると、関連先のフィールドでフィルターできます。

```typespec
@filter
author: User;
```

使用例（namedFilter や API クエリで）:
```json
{ "field": "author.id", "op": "eq", "value": "user-1" }
{ "field": "author.role", "op": "eq", "value": "admin" }
```

## 例

```typespec
@resource
@label("投稿")
model Post {
  @readonly
  id: string;

  @label("タイトル")
  @kind("text")
  title: string;

  @label("本文")
  @kind("longText")
  @ui(#{ inputHint: "richtext" })
  body: string;

  @label("状態")
  @kind("enum")
  @ui(#{ hint: "badge", inputHint: "select" })
  @options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;

  @label("著者")
  @kind("relation")
  @ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @relation(User, #{ labelField: "name", searchable: true })
  @required
  author: User;

  @label("公開日")
  @kind("date")
  publishedAt?: plainDate;

  @label("作成日時")
  @kind("datetime")
  @readonly
  createdAt: utcDateTime;
}
```

## 次のステップ

- [Validation](./validation.md) - バリデーション
- [Relation](./relation.md) - リレーション
