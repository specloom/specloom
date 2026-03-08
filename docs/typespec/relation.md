# Relation

Relation は他の Resource への参照を定義します。

## 基本

```typespec
@S.label("著者")
@S.kind("relation")
@S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
@S.relation(User, #{ labelField: "name" })
author: User;
```

## @relation

参照先の Resource と表示に使うフィールドを指定します。

```typespec
@S.relation(User, #{ labelField: "name" })
author: User;

@S.relation(Category, #{ labelField: "title" })
category: Category;
```

### オプション

| オプション | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| labelField | string | ⭕ | 表示に使うフィールド |
| valueField | string | | 値に使うフィールド（default: "id"） |
| searchable | boolean | | 検索可能か |

```typespec
@S.relation(User, #{
  labelField: "name",
  valueField: "id",
  searchable: true
})
author: User;
```

## 単一 / 複数

型から自動で判定されます。

```typespec
// 単一
@S.relation(User, #{ labelField: "name" })
author: User;

// 複数
@S.relation(Tag, #{ labelField: "name" })
tags: Tag[];
```

## @ui

表示と入力のヒントを `@ui` で指定します。

```typespec
@S.kind("relation")
@S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
@S.relation(User, #{ labelField: "name", searchable: true })
author: User;
```

### inputHint の使い分け

| inputHint | 用途 |
|-----------|------|
| select | 少数の固定選択肢（〜20件） |
| autocomplete | 検索して選ぶ（大量データ） |
| modal | 一覧から選ぶ（複雑な選択） |
| radio | 少数の選択肢（3〜5件） |

```typespec
// 少数の固定選択肢
@S.ui(#{ inputHint: "select" })
@S.relation(Category, #{ labelField: "name" })
category: Category;

// 検索して選ぶ
@S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
@S.relation(User, #{ labelField: "name", searchable: true })
author: User;

// 一覧から選ぶ
@S.ui(#{ inputHint: "modal" })
@S.relation(Product, #{ labelField: "name" })
products: Product[];
```

> 子リソースをフォーム内でインライン編集する場合は [@nested](./nested.md) を使用してください。

## 単一リレーション

```typespec
@S.label("著者")
@S.kind("relation")
@S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
@S.relation(User, #{ labelField: "name", searchable: true })
@S.required
author: User;

@S.label("カテゴリ")
@S.kind("relation")
@S.ui(#{ inputHint: "select" })
@S.relation(Category, #{ labelField: "name" })
@S.required
category: Category;
```

## 複数リレーション

```typespec
@S.label("タグ")
@S.kind("relation")
@S.ui(#{ inputHint: "autocomplete" })
@S.relation(Tag, #{ labelField: "name" })
@S.minItems(1)
@S.maxItems(5)
tags: Tag[];

@S.label("関連記事")
@S.kind("relation")
@S.ui(#{ inputHint: "modal" })
@S.relation(Post, #{ labelField: "title" })
relatedPosts: Post[];
```

## 複数リレーションのバリデーション

```typespec
@S.label("タグ")
@S.kind("relation")
@S.relation(Tag, #{ labelField: "name" })
@S.required          // 1つ以上必須
@S.minItems(1)       // 最小1個
@S.maxItems(5)       // 最大5個
tags: Tag[];
```

## Nested（子リソースのインライン編集）

子リソースを親フォーム内でインライン編集するには `@nested` デコレータを使います。

詳細は [Nested](./nested.md) を参照してください。

```typespec
@S.label("注文明細")
@S.nested(OrderItem, #{ min: 1, max: 50 })
items: OrderItem[];
```

## DB との関係

spec は「意味的な参照」を定義します。

```typespec
@S.relation(User, #{ labelField: "name" })
author: User;
```

これは「Post が User を参照している」という意味だけ。

以下は **実装側（ORM）の責務** です：

- FK 制約
- JOIN 方法
- 中間テーブル
- CASCADE

```
spec: 意味的な参照
実装: FK / JOIN / 中間テーブル
```

## 次のステップ

- [List View](./list.md) - 一覧画面
- [Form View](./form.md) - 作成・編集画面
