# Examples

完全な例を紹介します。

## ブログ投稿

### Resource

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

  @label("スラッグ")
  @kind("text")
  @pattern("slug")
  @maxLength(100)
  slug: string;

  @label("本文")
  @kind("longText")
  @ui(#{ inputHint: "richtext" })
  body: string;

  @label("状態")
  @kind("enum")
  @ui(#{ hint: "badge", inputHint: "select" })
  @options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  status: string;

  @label("著者")
  @kind("relation")
  @relation(User, #{ labelField: "name" })
  @ui(#{ hint: "avatar", inputHint: "autocomplete", searchable: true })
  @required
  author: User;

  @label("カテゴリ")
  @kind("relation")
  @relation(Category, #{ labelField: "name" })
  @ui(#{ inputHint: "select" })
  @required
  category: Category;

  @label("タグ")
  @kind("relation")
  @relation(Tag, #{ labelField: "name" })
  @ui(#{ hint: "badge", inputHint: "autocomplete", searchable: true })
  @maxItems(5)
  tags: Tag[];

  @label("公開日")
  @kind("datetime")
  @visibleWhen("status == 'published'")
  @requiredWhen("status == 'published'")
  publishedAt?: utcDateTime;

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

### List View

```typespec
@view(Post, "list")
@columns(["title", "status", "author", "category", "createdAt"])
@searchable(["title", "body"])
@sortable(["title", "createdAt", "updatedAt"])
@defaultSort("createdAt", "desc")
@selection("multi")
@clickAction("show")
@namedFilter("all", "すべて", #{})
@namedFilter("published", "公開中", #{ status: "published" })
@namedFilter("draft", "下書き", #{ status: "draft" })
model PostList {
  @action("create")
  @label("新規作成")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @action("bulkDelete")
  @label("一括削除")
  @requiresSelection(true)
  @allowedWhen("role == 'admin'")
  @confirm
  @ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;

  @rowAction("show")
  @label("詳細")
  @ui(#{ icon: "eye" })
  show: never;

  @rowAction("edit")
  @label("編集")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @rowAction("delete")
  @label("削除")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
```

### Form View

```typespec
@view(Post, "form")
@fields(["title", "slug", "body", "status", "author", "category", "tags"])
model PostForm {
  @action("save")
  @label("保存")
  @ui(#{ icon: "check", variant: "primary" })
  save: never;

  @action("cancel")
  @label("キャンセル")
  
  cancel: never;
}
```

### Show View

```typespec
@view(Post, "show")
@fields(["title", "slug", "body", "status", "author", "category", "tags", "publishedAt", "createdAt", "updatedAt"])
model PostShow {
  @action("edit")
  @label("編集")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;

  @action("publish")
  @label("公開")
  @allowedWhen("status == 'draft'")
  @ui(#{ icon: "globe", variant: "primary" })
  publish: never;

  @action("unpublish")
  @label("非公開")
  @allowedWhen("status == 'published'")
  unpublish: never;

  @action("archive")
  @label("アーカイブ")
  @allowedWhen("status == 'published'")
  @confirm
  archive: never;
}
```

---

## ユーザー管理

### Resource

```typespec
@resource
@label("ユーザー")
@requiredOneOf(["email", "phone"])
model User {
  @readonly
  id: string;

  @label("名前")
  @kind("text")
  @required
  @maxLength(50)
  name: string;

  @label("メール")
  @kind("email")
  @pattern("email")
  email?: string;

  @label("電話")
  @kind("text")
  @pattern("phone")
  phone?: string;

  @label("ロール")
  @kind("enum")
  @ui(#{ hint: "badge", inputHint: "select" })
  @options(#[
    #{ value: "admin", label: "管理者" },
    #{ value: "editor", label: "編集者" },
    #{ value: "viewer", label: "閲覧者" }
  ])
  @required
  role: string;

  @label("アバター")
  @kind("image")
  @ui(#{ inputHint: "file" })
  avatar?: string;

  @label("有効")
  @kind("boolean")
  @ui(#{ inputHint: "switch" })
  active: boolean;

  @label("作成日時")
  @kind("datetime")
  @readonly
  createdAt: utcDateTime;
}
```

### List View

```typespec
@view(User, "list")
@columns(["name", "email", "role", "active", "createdAt"])
@searchable(["name", "email"])
@sortable(["name", "createdAt"])
@defaultSort("createdAt", "desc")
@namedFilter("all", "すべて", #{})
@namedFilter("admin", "管理者", #{ role: "admin" })
@namedFilter("active", "有効", #{ active: true })
model UserList {
  @action("create")
  @label("新規作成")
  @allowedWhen("role == 'admin'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @rowAction("show")
  @label("詳細")
  show: never;

  @rowAction("edit")
  @label("編集")
  @allowedWhen("role == 'admin'")
  @ui(#{ icon: "pencil" })
  edit: never;
}
```

---

## 注文管理

### Resource

```typespec
@resource
@label("注文")
model Order {
  @readonly
  id: string;

  @label("注文番号")
  @kind("text")
  @readonly
  orderNumber: string;

  @label("顧客")
  @kind("relation")
  @relation(Customer, #{ labelField: "name" })
  @ui(#{ inputHint: "autocomplete", searchable: true })
  @required
  customer: Customer;

  @label("商品")
  @kind("relation")
  @relation(Product, #{ labelField: "name" })
  @ui(#{ inputHint: "modal" })
  @minItems(1)
  products: Product[];

  @label("小計")
  @kind("number")
  @computed
  @ui(#{ format: "currency" })
  subtotal: int32;

  @label("税額")
  @kind("number")
  @computed
  @ui(#{ format: "currency" })
  tax: int32;

  @label("合計")
  @kind("number")
  @computed
  @ui(#{ format: "currency" })
  total: int32;

  @label("状態")
  @kind("enum")
  @ui(#{ hint: "badge", inputHint: "select" })
  @options(#[
    #{ value: "pending", label: "保留中" },
    #{ value: "confirmed", label: "確定" },
    #{ value: "shipped", label: "発送済" },
    #{ value: "delivered", label: "配達完了" },
    #{ value: "cancelled", label: "キャンセル" }
  ])
  status: string;

  @label("注文日時")
  @kind("datetime")
  @readonly
  orderedAt: utcDateTime;
}
```

### Show View（状態遷移）

```typespec
@view(Order, "show")
@fields(["orderNumber", "customer", "products", "subtotal", "tax", "total", "status", "orderedAt"])
model OrderShow {
  @action("confirm")
  @label("確定")
  @allowedWhen("status == 'pending'")
  @ui(#{ icon: "check", variant: "primary" })
  confirm: never;

  @action("ship")
  @label("発送")
  @allowedWhen("status == 'confirmed'")
  @ui(#{ icon: "truck", variant: "primary" })
  ship: never;

  @action("deliver")
  @label("配達完了")
  @allowedWhen("status == 'shipped'")
  @ui(#{ icon: "check", variant: "primary" })
  deliver: never;

  @action("cancel")
  @label("キャンセル")
  @allowedWhen("status == 'pending' || status == 'confirmed'")
  @confirm("注文をキャンセルしますか？")
  @ui(#{ icon: "x", variant: "danger" })
  cancel: never;
}

---

## 条件付き UI パターン

`@visibleWhen` / `@requiredWhen` の典型的なユースケース集です。

### 状態依存フィールド

公開状態に応じてフィールドを出し分ける。

```typespec
@resource
@label("記事")
model Article {
  @readonly
  id: string;

  @label("タイトル")
  @kind("text")
  @required
  title: string;

  @label("状態")
  @kind("enum")
  @options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "scheduled", label: "予約公開" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;

  // 予約公開・公開中の場合のみ表示＆必須
  @label("公開日時")
  @kind("datetime")
  @visibleWhen("status == 'scheduled' || status == 'published'")
  @requiredWhen("status == 'scheduled' || status == 'published'")
  publishedAt?: utcDateTime;

  // 下書きでない場合のみ表示
  @label("OGP 画像")
  @kind("image")
  @visibleWhen("status != 'draft'")
  ogImage?: string;
}
```

### 種別による分岐

リンクの種別に応じて入力欄を切り替える。

```typespec
@resource
@label("リンク")
model Link {
  @readonly
  id: string;

  @label("種別")
  @kind("enum")
  @options(#[
    #{ value: "internal", label: "内部ページ" },
    #{ value: "external", label: "外部URL" },
    #{ value: "file", label: "ファイル" }
  ])
  @required
  type: string;

  @label("ページ")
  @kind("relation")
  @relation(Page, #{ labelField: "title" })
  @visibleWhen("type == 'internal'")
  @requiredWhen("type == 'internal'")
  page?: Page;

  @label("URL")
  @kind("url")
  @visibleWhen("type == 'external'")
  @requiredWhen("type == 'external'")
  url?: string;

  @label("ファイル")
  @kind("file")
  @visibleWhen("type == 'file'")
  @requiredWhen("type == 'file'")
  file?: string;
}
```

### ロール依存フィールド

管理者のみに見える管理用フィールド。

```typespec
@resource
@label("ユーザー")
model User {
  @readonly
  id: string;

  @label("名前")
  @required
  name: string;

  @label("メール")
  @kind("email")
  @required
  email: string;

  // 管理者のみ閲覧・編集可能
  @label("内部メモ")
  @kind("longText")
  @visibleWhen("role == 'admin'")
  internalNote?: string;

  // 管理者のみ表示
  @label("API キー")
  @kind("text")
  @visibleWhen("role == 'admin'")
  @createOnly
  apiKey?: string;
}
```

### パスワード変更フォーム

`@match` と `@requiredWhen` の組み合わせ。

```typespec
@resource
@label("プロフィール")
model Profile {
  @readonly
  id: string;

  @label("名前")
  @required
  name: string;

  // パスワードを入力した場合のみ確認欄を必須に
  @label("新しいパスワード")
  @kind("text")
  @ui(#{ inputHint: "password" })
  @minLength(8)
  newPassword?: string;

  @label("パスワード確認")
  @kind("text")
  @ui(#{ inputHint: "password" })
  @match("newPassword")
  @requiredWhen("newPassword != ''")
  newPasswordConfirm?: string;
}
```
