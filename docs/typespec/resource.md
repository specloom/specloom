# Resource

Resource はデータの定義です。フィールド、バリデーション、リレーションを含みます。

## 基本
```typespec
import "@specloom/typespec";

using Specloom;

@resource
model Post {
  id: string;
  title: string;
}
```

`@resource` を付けると、そのモデルが specloom の Resource として認識されます。

## 計算フィールド（@computed）

`@computed` は DB に保存しない計算値フィールドを表します。

```typespec
@resource
model User {
  firstName: string;
  lastName: string;

  @label("氏名")
  @computed
  fullName: string;
}
```

- Form では編集対象から除外されます
- List / Show では表示可能です
- 値の算出ロジックはサーバー側の責務です

## @label

表示名を設定します。
```typespec
@resource
@label("投稿")
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
@resource
model Post { }

@resource
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

using Specloom;

@resource
@label("投稿")
model Post {
  // fields...
}

@view(Post, "list")
model PostList {
  // ...
}

@view(Post, "form")
model PostForm {
  // ...
}

@view(Post, "show")
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

using Specloom;

@resource
@label("投稿")
model Post {
  // fields...
}
```
```typespec
// post/list.tsp
import "@specloom/typespec";
import "./resource.tsp";

using Specloom;

@view(Post, "list")
model PostList {
  // ...
}
```

## 完全な例
```typespec
import "@specloom/typespec";

using Specloom;

@resource
@label("投稿")
model Post {
  @readonly
  id: string;

  @label("タイトル")
  @kind("text")
  @required
  @maxLength(100)
  title: string;

  @label("本文")
  @kind("longText")
  @inputHint("richtext")
  body: string;

  @label("状態")
  @kind("enum")
  @hint("badge")
  @options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  status: string;

  @label("著者")
  @kind("relation")
  @hint("avatar")
  @relation(User, #{ labelField: "name", searchable: true })
  @required
  author: User;

  @label("タグ")
  @kind("relation")
  @relation(Tag, #{ labelField: "name" })
  @cardinality("many")
  tags: Tag[];

  @label("作成日時")
  @kind("datetime")
  @readonly
  createdAt: utcDateTime;

  @label("更新日時")
  @kind("datetime")
  @readonly
  updatedAt: utcDateTime;
}
```

## 次のステップ

- [Field](./field.md) - フィールドの詳細
- [Validation](./validation.md) - バリデーション
- [Relation](./relation.md) - リレーション
