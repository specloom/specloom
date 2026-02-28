# Examples

完全な例を紹介します。

## ブログ投稿

### Resource

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

  @S.label("スラッグ")
  @S.kind("text")
  @S.pattern("slug")
  @S.maxLength(100)
  slug: string;

  @S.label("本文")
  @S.kind("longText")
  @S.ui(#{ inputHint: "richtext" })
  body: string;

  @S.label("状態")
  @S.kind("enum")
  @S.ui(#{ hint: "badge", inputHint: "select" })
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  status: string;

  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete", searchable: true })
  @S.required
  author: User;

  @S.label("カテゴリ")
  @S.kind("relation")
  @S.relation(Category, #{ labelField: "name" })
  @S.ui(#{ inputHint: "select" })
  @S.required
  category: Category;

  @S.label("タグ")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name" })
  @S.ui(#{ hint: "badge", inputHint: "autocomplete", searchable: true })
  @S.maxItems(5)
  tags: Tag[];

  @S.label("公開日")
  @S.kind("datetime")
  @S.visibleWhen("status == 'published'")
  @S.requiredWhen("status == 'published'")
  publishedAt?: utcDateTime;

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

### List View

```typespec
@S.view(Post, "list")
@S.columns(["title", "status", "author", "category", "createdAt"])
@S.searchable(["title", "body"])
@S.sortable(["title", "createdAt", "updatedAt"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
@S.namedFilter("all", "すべて", #{})
@S.namedFilter("published", "公開中", #{ status: "published" })
@S.namedFilter("draft", "下書き", #{ status: "draft" })
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
})
@S.action("bulkDelete", #{
  label: "一括削除",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: "選択した項目を削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
@S.rowAction("show", #{ label: "詳細", ui: #{ icon: "eye" } })
@S.rowAction("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.rowAction("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "本当に削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
model PostList {}
```

### Form View

```typespec
@S.view(Post, "form")
@S.fields(["title", "slug", "body", "status", "author", "category", "tags"])
@S.action("save", #{ label: "保存", ui: #{ icon: "check", variant: "primary" } })
@S.action("cancel", #{ label: "キャンセル" })
model PostForm {}
```

### Show View

```typespec
@S.view(Post, "show")
@S.fields(["title", "slug", "body", "status", "author", "category", "tags", "publishedAt", "createdAt", "updatedAt"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "本当に削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
@S.action("publish", #{ label: "公開", allowedWhen: "status == 'draft'", ui: #{ icon: "globe", variant: "primary" } })
@S.action("unpublish", #{ label: "非公開", allowedWhen: "status == 'published'" })
@S.action("archive", #{ label: "アーカイブ", allowedWhen: "status == 'published'", confirm: "アーカイブしますか？" })
model PostShow {}
```

---

## ユーザー管理

### Resource

```typespec
@S.resource
@S.label("ユーザー")
@S.requiredOneOf(["email", "phone"])
model User {
  @S.readonly
  id: string;

  @S.label("名前")
  @S.kind("text")
  @S.required
  @S.maxLength(50)
  name: string;

  @S.label("メール")
  @S.kind("email")
  @S.pattern("email")
  email?: string;

  @S.label("電話")
  @S.kind("text")
  @S.pattern("phone")
  phone?: string;

  @S.label("ロール")
  @S.kind("enum")
  @S.ui(#{ hint: "badge", inputHint: "select" })
  @S.options(#[
    #{ value: "admin", label: "管理者" },
    #{ value: "editor", label: "編集者" },
    #{ value: "viewer", label: "閲覧者" }
  ])
  @S.required
  role: string;

  @S.label("アバター")
  @S.kind("image")
  @S.ui(#{ inputHint: "file" })
  avatar?: string;

  @S.label("有効")
  @S.kind("boolean")
  @S.ui(#{ inputHint: "switch" })
  active: boolean;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  createdAt: utcDateTime;
}
```

### List View

```typespec
@S.view(User, "list")
@S.columns(["name", "email", "role", "active", "createdAt"])
@S.searchable(["name", "email"])
@S.sortable(["name", "createdAt"])
@S.defaultSort("createdAt", "desc")
@S.namedFilter("all", "すべて", #{})
@S.namedFilter("admin", "管理者", #{ role: "admin" })
@S.namedFilter("active", "有効", #{ active: true })
@S.action("create", #{ label: "新規作成", allowedWhen: "role == 'admin'", ui: #{ icon: "plus", variant: "primary" } })
@S.rowAction("show", #{ label: "詳細" })
@S.rowAction("edit", #{ label: "編集", allowedWhen: "role == 'admin'", ui: #{ icon: "pencil" } })
model UserList {}
```

---

## 注文管理

### Resource

```typespec
@S.resource
@S.label("注文")
model Order {
  @S.readonly
  id: string;

  @S.label("注文番号")
  @S.kind("text")
  @S.readonly
  orderNumber: string;

  @S.label("顧客")
  @S.kind("relation")
  @S.relation(Customer, #{ labelField: "name" })
  @S.ui(#{ inputHint: "autocomplete", searchable: true })
  @S.required
  customer: Customer;

  @S.label("商品")
  @S.kind("relation")
  @S.relation(Product, #{ labelField: "name" })
  @S.ui(#{ inputHint: "modal" })
  @S.minItems(1)
  products: Product[];

  @S.label("小計")
  @S.kind("number")
  @S.computed
  @S.ui(#{ format: "currency" })
  subtotal: int32;

  @S.label("税額")
  @S.kind("number")
  @S.computed
  @S.ui(#{ format: "currency" })
  tax: int32;

  @S.label("合計")
  @S.kind("number")
  @S.computed
  @S.ui(#{ format: "currency" })
  total: int32;

  @S.label("状態")
  @S.kind("enum")
  @S.ui(#{ hint: "badge", inputHint: "select" })
  @S.options(#[
    #{ value: "pending", label: "保留中" },
    #{ value: "confirmed", label: "確定" },
    #{ value: "shipped", label: "発送済" },
    #{ value: "delivered", label: "配達完了" },
    #{ value: "cancelled", label: "キャンセル" }
  ])
  status: string;

  @S.label("注文日時")
  @S.kind("datetime")
  @S.readonly
  orderedAt: utcDateTime;
}
```

### Show View（状態遷移）

```typespec
@S.view(Order, "show")
@S.fields(["orderNumber", "customer", "products", "subtotal", "tax", "total", "status", "orderedAt"])
@S.action("confirm", #{ label: "確定", allowedWhen: "status == 'pending'", ui: #{ icon: "check", variant: "primary" } })
@S.action("ship", #{ label: "発送", allowedWhen: "status == 'confirmed'", ui: #{ icon: "truck", variant: "primary" } })
@S.action("deliver", #{ label: "配達完了", allowedWhen: "status == 'shipped'", ui: #{ icon: "check", variant: "primary" } })
@S.action("cancel", #{
  label: "キャンセル",
  allowedWhen: "status == 'pending' || status == 'confirmed'",
  confirm: "注文をキャンセルしますか？",
  ui: #{ icon: "x", variant: "danger" }
})
model OrderShow {}
```

---

## 条件付き UI パターン

`@visibleWhen` / `@requiredWhen` の典型的なユースケース集です。

### 状態依存フィールド

公開状態に応じてフィールドを出し分ける。

```typespec
@S.resource
@S.label("記事")
model Article {
  @S.readonly
  id: string;

  @S.label("タイトル")
  @S.kind("text")
  @S.required
  title: string;

  @S.label("状態")
  @S.kind("enum")
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "scheduled", label: "予約公開" },
    #{ value: "published", label: "公開中" }
  ])
  status: string;

  // 予約公開・公開中の場合のみ表示＆必須
  @S.label("公開日時")
  @S.kind("datetime")
  @S.visibleWhen("status == 'scheduled' || status == 'published'")
  @S.requiredWhen("status == 'scheduled' || status == 'published'")
  publishedAt?: utcDateTime;

  // 下書きでない場合のみ表示
  @S.label("OGP 画像")
  @S.kind("image")
  @S.visibleWhen("status != 'draft'")
  ogImage?: string;
}
```

### 種別による分岐

リンクの種別に応じて入力欄を切り替える。

```typespec
@S.resource
@S.label("リンク")
model Link {
  @S.readonly
  id: string;

  @S.label("種別")
  @S.kind("enum")
  @S.options(#[
    #{ value: "internal", label: "内部ページ" },
    #{ value: "external", label: "外部URL" },
    #{ value: "file", label: "ファイル" }
  ])
  @S.required
  type: string;

  @S.label("ページ")
  @S.kind("relation")
  @S.relation(Page, #{ labelField: "title" })
  @S.visibleWhen("type == 'internal'")
  @S.requiredWhen("type == 'internal'")
  page?: Page;

  @S.label("URL")
  @S.kind("url")
  @S.visibleWhen("type == 'external'")
  @S.requiredWhen("type == 'external'")
  url?: string;

  @S.label("ファイル")
  @S.kind("file")
  @S.visibleWhen("type == 'file'")
  @S.requiredWhen("type == 'file'")
  file?: string;
}
```

### ロール依存フィールド

管理者のみに見える管理用フィールド。

```typespec
@S.resource
@S.label("ユーザー")
model User {
  @S.readonly
  id: string;

  @S.label("名前")
  @S.required
  name: string;

  @S.label("メール")
  @S.kind("email")
  @S.required
  email: string;

  // 管理者のみ閲覧・編集可能
  @S.label("内部メモ")
  @S.kind("longText")
  @S.visibleWhen("role == 'admin'")
  internalNote?: string;

  // 管理者のみ表示
  @S.label("API キー")
  @S.kind("text")
  @S.visibleWhen("role == 'admin'")
  @S.createOnly
  apiKey?: string;
}
```

### パスワード変更フォーム

`@match` と `@requiredWhen` の組み合わせ。

```typespec
@S.resource
@S.label("プロフィール")
model Profile {
  @S.readonly
  id: string;

  @S.label("名前")
  @S.required
  name: string;

  // パスワードを入力した場合のみ確認欄を必須に
  @S.label("新しいパスワード")
  @S.kind("text")
  @S.ui(#{ inputHint: "password" })
  @S.minLength(8)
  newPassword?: string;

  @S.label("パスワード確認")
  @S.kind("text")
  @S.ui(#{ inputHint: "password" })
  @S.match("newPassword")
  @S.requiredWhen("newPassword != ''")
  newPasswordConfirm?: string;
}
```
