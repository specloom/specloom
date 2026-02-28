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
| inline | 子リソースをフォーム内でインライン編集（複数リレーション向け） |

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

// 子リソースをインライン編集
@S.ui(#{ inputHint: "inline" })
@S.relation(OrderItem, #{ labelField: "product" })
@S.minItems(1)
items: OrderItem[];
```

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

## インラインリレーション

`inputHint: "inline"` を指定すると、子リソースを親フォーム内でインライン編集できます。既存レコードの選択ではなく、子レコードの追加・編集・削除をフォーム内で行います。

### 仕組み

1. 子リソースを `@resource` で定義（フィールド、バリデーション、kind）
2. 子リソースに `form` view を定義（編集するフィールドを指定）
3. 親リソースのリレーションで `inputHint: "inline"` を指定

UI は子リソースの form view を参照して、インラインフォームを構築します。

```typespec
// 1. 子リソース定義
@S.resource
@S.label("注文明細")
model OrderItem {
  @S.readonly id: string;

  @S.label("商品")
  @S.kind("relation")
  @S.relation(Product, #{ labelField: "name" })
  @S.ui(#{ inputHint: "autocomplete", searchable: true })
  @S.required
  product: Product;

  @S.label("数量")
  @S.kind("number")
  @S.required
  @S.min(1)
  quantity: int32;

  @S.label("単価")
  @S.kind("number")
  @S.readonly
  @S.ui(#{ format: "currency" })
  unitPrice: int32;

  @S.label("金額")
  @S.kind("number")
  @S.computed
  @S.ui(#{ format: "currency" })
  amount: int32;
}

// 2. 子リソースのフォーム
@S.view(OrderItem, "form")
@S.fields(["product", "quantity"])
model OrderItemForm {}

// 3. 親リソースで inline 指定
@S.resource
@S.label("注文")
model Order {
  @S.readonly id: string;

  @S.label("顧客")
  @S.kind("relation")
  @S.relation(Customer, #{ labelField: "name" })
  @S.required
  customer: Customer;

  @S.label("注文明細")
  @S.kind("relation")
  @S.relation(OrderItem, #{ labelField: "product" })
  @S.ui(#{ inputHint: "inline" })
  @S.minItems(1)
  @S.maxItems(50)
  items: OrderItem[];
}

@S.view(Order, "form")
@S.fields(["customer", "items"])
model OrderForm {}
```

### 他の inputHint との違い

| inputHint | 操作 | 対象 |
|-----------|------|------|
| select / autocomplete / modal | 既存レコードを選択 | 参照 |
| inline | 子レコードを追加・編集・削除 | 所有 |

### 行数制限

`@minItems` / `@maxItems` で行数を制御します。

```typespec
@S.minItems(1)    // 最低1行
@S.maxItems(50)   // 最大50行
items: OrderItem[];
```

### readonly / computed

子リソースの `@readonly` や `@computed` フィールドは form view の `@fields` に含めても編集不可として表示されます。金額の自動計算などに使います。

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
