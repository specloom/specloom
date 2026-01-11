# Form View

Form View は作成・編集画面を定義します。

## 基本

```typespec
@view(Post, "form")
model PostForm {}
```

## @fields

表示するフィールドを指定します。

```typespec
@view(Post, "form")
@fields(["title", "body", "status", "author", "tags"])
model PostForm {}
```

省略すると Resource の編集可能なフィールドが表示されます（`@readonly`, `@computed` 除く）。

## フィールドの順序

`@fields` の配列順がフォームの表示順になります。

```typespec
@view(Post, "form")
@fields(["title", "status", "body", "author", "tags"])
model PostForm {}
```

## Relation フィールド

Relation フィールドは Resource の `@ui` で入力方法を指定します。

```typespec
@resource
model Post {
  @label("著者")
  @kind("relation")
  @relation(User, #{ labelField: "name" })
  @required
  @ui(#{ inputHint: "autocomplete", searchable: true })
  author: User;

  @label("カテゴリ")
  @kind("relation")
  @relation(Category, #{ labelField: "name" })
  @required
  @ui(#{ inputHint: "select" })
  category: Category;

  @label("タグ")
  @kind("relation")
  @relation(Tag, #{ labelField: "name" })
  @minItems(1)
  @maxItems(5)
  @ui(#{ inputHint: "autocomplete", searchable: true })
  tags: Tag[];
}
```

### inputHint の選び方

| inputHint | 用途 | searchable |
|-----------|------|------------|
| select | 少数の固定選択肢（〜20件） | false |
| radio | 少数の選択肢（3〜5件） | false |
| autocomplete | 検索して選ぶ | true |
| modal | 一覧から選ぶ | true |

### 選択肢の取得

- `searchable: true` → UI が検索 API を叩く
- `searchable: false` → VM に選択肢が含まれる

## Actions

```typespec
@view(Post, "form")
@fields(["title", "body", "status", "author", "tags"])
model PostForm {
  @action("save")
  @label("保存")
  @placement("header")
  @ui(#{ icon: "check", variant: "primary" })
  save: never;

  @action("cancel")
  @label("キャンセル")
  @placement("header")
  cancel: never;
}
```

## 作成 / 編集の区別

同じ Form View を作成・編集で共有します。違いは VM で判定します。

```json
{
  "mode": "create",
  "resource": "Post",
  "fields": [...]
}
```

```json
{
  "mode": "edit",
  "resource": "Post",
  "fields": [...],
  "values": {...}
}
```

UI は `mode` を見て：
- `create`: 新規作成として扱う
- `edit`: 既存データを表示

## 完全な例

```typespec
@view(Post, "form")
@fields(["title", "body", "status", "author", "tags"])
model PostForm {
  @action("save")
  @label("保存")
  @placement("header")
  @ui(#{ icon: "check", variant: "primary" })
  save: never;

  @action("cancel")
  @label("キャンセル")
  @placement("header")
  cancel: never;

  @action("saveDraft")
  @label("下書き保存")
  @placement("header")
  @allowedWhen("status == 'draft'")
  saveDraft: never;
}
```

## 次のステップ

- [Show View](./show.md) - 詳細画面
- [Action](./action.md) - アクションの詳細
