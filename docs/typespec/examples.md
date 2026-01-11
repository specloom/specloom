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
  @kind("status")
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
  @placement("header")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @action("show")
  @label("詳細")
  @placement("row")
  @ui(#{ icon: "eye" })
  show: never;

  @action("edit")
  @label("編集")
  @placement("row")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @placement("row")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;

  @action("bulkDelete")
  @label("一括削除")
  @placement("bulk")
  @allowedWhen("role == 'admin'")
  @confirm
  @ui(#{ icon: "trash", variant: "danger" })
  bulkDelete: never;
}
```

### Form View

```typespec
@view(Post, "form")
@fields(["title", "slug", "body", "status", "author", "category", "tags"])
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

### Show View

```typespec
@view(Post, "show")
@fields(["title", "slug", "body", "status", "author", "category", "tags", "publishedAt", "createdAt", "updatedAt"])
model PostShow {
  @action("edit")
  @label("編集")
  @placement("header")
  @allowedWhen("role == 'admin' || role == 'editor'")
  @ui(#{ icon: "pencil" })
  edit: never;

  @action("delete")
  @label("削除")
  @placement("header")
  @allowedWhen("role == 'admin'")
  @confirm("本当に削除しますか？")
  @ui(#{ icon: "trash", variant: "danger" })
  delete: never;

  @action("publish")
  @label("公開")
  @placement("header")
  @allowedWhen("status == 'draft'")
  @ui(#{ icon: "globe", variant: "primary" })
  publish: never;

  @action("unpublish")
  @label("非公開")
  @placement("header")
  @allowedWhen("status == 'published'")
  unpublish: never;

  @action("archive")
  @label("アーカイブ")
  @placement("header")
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
  @kind("status")
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
  @placement("header")
  @allowedWhen("role == 'admin'")
  @ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @action("show")
  @label("詳細")
  @placement("row")
  show: never;

  @action("edit")
  @label("編集")
  @placement("row")
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
  @kind("status")
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
  @placement("header")
  @allowedWhen("status == 'pending'")
  @ui(#{ icon: "check", variant: "primary" })
  confirm: never;

  @action("ship")
  @label("発送")
  @placement("header")
  @allowedWhen("status == 'confirmed'")
  @ui(#{ icon: "truck", variant: "primary" })
  ship: never;

  @action("deliver")
  @label("配達完了")
  @placement("header")
  @allowedWhen("status == 'shipped'")
  @ui(#{ icon: "check", variant: "primary" })
  deliver: never;

  @action("cancel")
  @label("キャンセル")
  @placement("header")
  @allowedWhen("status == 'pending' || status == 'confirmed'")
  @confirm("注文をキャンセルしますか？")
  @ui(#{ icon: "x", variant: "danger" })
  cancel: never;
}
```
