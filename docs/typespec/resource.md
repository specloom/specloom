# Resource

Resource はデータの定義です。フィールド、バリデーション、リレーションを含みます。

## 基本
```typespec
import "@specloom/typespec";

@S.resource
model Post {
  id: string;
  title: string;
}
```

`@resource` を付けると、そのモデルが specloom の Resource として認識されます。

## 計算フィールド（@computed）

`@computed` は DB に保存しない計算値フィールドを表します。

```typespec
@S.resource
model User {
  firstName: string;
  lastName: string;

  @S.label("氏名")
  @S.computed
  fullName: string;
}
```

- Form では編集対象から除外されます
- List / Show では表示可能です
- 値の算出ロジックはサーバー側の責務です

## @label

表示名を設定します。
```typespec
@S.resource
@S.label("投稿")
model Post {
  // ...
}
```

省略すると、モデル名がそのまま使われます。

## 命名規則

| 要素 | 規則 | 例 |
|------|------|-----|
| モデル名 | PascalCase、単数形 | Post, User, OrderItem |
| フィールド名 | camelCase または snake_case | createdAt または created_at |

フィールド名はプロジェクト内で統一してください。
```typespec
// ⭕ 良い
@S.resource
model Post { }

@S.resource
model OrderItem { }

// ❌ 悪い
model posts { }   // 複数形
```

## ファイル構成

### パターン①：1 ファイル
```
specs/
├── post.tsp
├── user.tsp
└── tag.tsp
```
```typespec
// post.tsp
import "@specloom/typespec";

@S.resource
@S.label("投稿")
model Post {
  // fields...
}

@S.view(Post, "list")
model PostList {
  // ...
}

@S.view(Post, "form")
model PostForm {
  // ...
}

@S.view(Post, "show")
model PostShow {
  // ...
}
```

### パターン②：1 フォルダ
```
specs/
└── post/
    ├── resource.tsp
    ├── list.tsp
    ├── form.tsp
    └── show.tsp
```
```typespec
// post/resource.tsp
import "@specloom/typespec";

@S.resource
@S.label("投稿")
model Post {
  // fields...
}
```
```typespec
// post/list.tsp
import "@specloom/typespec";
import "./resource.tsp";

@S.view(Post, "list")
model PostList {
  // ...
}
```

## 完全な例
```typespec
import "@specloom/typespec";

@S.resource
@S.label("投稿")
model Post {
  @S.readonly
  id: string;

  @S.label("タイトル")
  @S.kind("text")
  @S.required
  @S.maxLength(100)
  title: string;

  @S.label("本文")
  @S.kind("longText")
  @S.inputHint("richtext")
  body: string;

  @S.label("状態")
  @S.kind("enum")
  @S.hint("badge")
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  status: string;

  @S.label("著者")
  @S.kind("relation")
  @S.hint("avatar")
  @S.relation(User, #{ labelField: "name", searchable: true })
  @S.required
  author: User;

  @S.label("タグ")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name" })
  @S.cardinality("many")
  tags: Tag[];

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  createdAt: utcDateTime;

  @S.label("更新日時")
  @S.kind("datetime")
  @S.readonly
  updatedAt: utcDateTime;
}
```

## 次のステップ

- [Field](./field.md) - フィールドの詳細
- [Validation](./validation.md) - バリデーション
- [Relation](./relation.md) - リレーション
