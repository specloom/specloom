# Relation

Relation は他の Resource への参照を定義します。

## 基本

```typespec
@label("著者")
@kind("relation")
@ui(#{ hint: "avatar", inputHint: "autocomplete" })
@relation(User, #{ labelField: "name" })
author: User;
```

## @relation

参照先の Resource と表示に使うフィールドを指定します。

```typespec
@relation(User, #{ labelField: "name" })
author: User;

@relation(Category, #{ labelField: "title" })
category: Category;
```

### オプション

| オプション | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| labelField | string | ⭕ | 表示に使うフィールド |
| valueField | string | | 値に使うフィールド（default: "id"） |
| searchable | boolean | | 検索可能か |

```typespec
@relation(User, #{ 
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
@relation(User, #{ labelField: "name" })
author: User;

// 複数
@relation(Tag, #{ labelField: "name" })
tags: Tag[];
```

## @ui

表示と入力のヒントを `@ui` で指定します。

```typespec
@kind("relation")
@ui(#{ hint: "avatar", inputHint: "autocomplete" })
@relation(User, #{ labelField: "name", searchable: true })
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
@ui(#{ inputHint: "select" })
@relation(Category, #{ labelField: "name" })
category: Category;

// 検索して選ぶ
@ui(#{ hint: "avatar", inputHint: "autocomplete" })
@relation(User, #{ labelField: "name", searchable: true })
author: User;

// 一覧から選ぶ
@ui(#{ inputHint: "modal" })
@relation(Product, #{ labelField: "name" })
products: Product[];
```

## 単一リレーション

```typespec
@label("著者")
@kind("relation")
@ui(#{ hint: "avatar", inputHint: "autocomplete" })
@relation(User, #{ labelField: "name", searchable: true })
@required
author: User;

@label("カテゴリ")
@kind("relation")
@ui(#{ inputHint: "select" })
@relation(Category, #{ labelField: "name" })
@required
category: Category;
```

## 複数リレーション

```typespec
@label("タグ")
@kind("relation")
@ui(#{ inputHint: "autocomplete" })
@relation(Tag, #{ labelField: "name" })
@minItems(1)
@maxItems(5)
tags: Tag[];

@label("関連記事")
@kind("relation")
@ui(#{ inputHint: "modal" })
@relation(Post, #{ labelField: "title" })
relatedPosts: Post[];
```

## 複数リレーションのバリデーション

```typespec
@label("タグ")
@kind("relation")
@relation(Tag, #{ labelField: "name" })
@required          // 1つ以上必須
@minItems(1)       // 最小1個
@maxItems(5)       // 最大5個
tags: Tag[];
```

## DB との関係

spec は「意味的な参照」を定義します。

```typespec
@relation(User, #{ labelField: "name" })
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
