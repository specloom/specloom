import "../lib/main.tsp";

// ============================================================
// Models (Resources)
// ============================================================

@S.resource
@S.label("ユーザー")
model User {
  @S.readonly
  id: string;

  @S.label("名前")
  @S.required
  name: string;

  @S.label("パスワード")
  @S.kind("password")
  @S.required
  @S.createOnly
  @S.minLength(8)
  password: string;
}

@S.resource
@S.label("タグ")
model Tag {
  @S.readonly
  id: string;

  @S.label("タグ名")
  @S.required
  name: string;
}

// パターン1: TypeSpec enum（値のみ、ラベルは値と同じ）
enum PostStatus {
  draft,
  published,
  archived,
}

// パターン2: TypeSpec enum with values（カスタム値）
enum Priority {
  low: "low",
  medium: "medium",
  high: "high",
}

// パターン3: TypeSpec enum + @options でラベルをカスタマイズ
enum Category {
  tech,
  life,
  news,
}

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
  @S.ui(#{ inputHint: "richtext" })
  body: string;

  // パターン1: TypeSpec enum + @options でラベルを日本語化
  @S.label("状態")
  @S.kind("enum")
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  @S.ui(#{ hint: "badge", inputHint: "select" })
  status: PostStatus;

  // パターン2: TypeSpec enum + @options でラベルを日本語化
  @S.label("優先度")
  @S.kind("enum")
  @S.options(#[
    #{ value: "low", label: "低" },
    #{ value: "medium", label: "中" },
    #{ value: "high", label: "高" }
  ])
  priority: Priority;

  // パターン3: TypeSpec enum + @options でラベルをカスタマイズ
  // （enum から options 自動生成されるが、@options で上書きして日本語ラベルを指定）
  @S.label("カテゴリ")
  @S.kind("enum")
  @S.options(#[
    #{ value: "tech", label: "テクノロジー" },
    #{ value: "life", label: "ライフスタイル" },
    #{ value: "news", label: "ニュース" }
  ])
  category: Category;

  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @S.required
  author: User;

  @S.label("タグ")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name" })
  @S.minItems(1)
  @S.maxItems(5)
  tags: Tag[];

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  createdAt: utcDateTime;
}

// ============================================================
// Views
// ============================================================

@S.view(Post, "list")
@S.columns(#["title", "status", "author", "createdAt"])
@S.searchable(#["title"])
@S.sortable(#["title", "createdAt"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
})
@S.action("bulkDelete", #{
  label: "一括削除",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: "選択した項目を削除しますか？"
})
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

@S.view(Post, "form")
@S.fields(#["title", "body", "status", "priority", "category", "author", "tags"])
@S.action("save", #{
  label: "保存",
  ui: #{ icon: "check", variant: "primary" }
})
@S.action("cancel", #{ label: "キャンセル" })
model PostForm {}

@S.view(Post, "show")
@S.fields(#["title", "body", "status", "priority", "category", "author", "tags", "createdAt"])
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
model PostShow {}

// ============================================================
// Dialog Model for Password Change
// ============================================================

model ChangePasswordDialog {
  @S.label("新しいパスワード")
  @S.kind("password")
  @S.required
  @S.minLength(8)
  password: string;

  @S.label("パスワード（確認）")
  @S.kind("password")
  @S.required
  @S.minLength(8)
  @S.match("password")
  confirm_password: string;
}

// ============================================================
// User Show View with Dialog Action
// ============================================================

@S.view(User, "show")
@S.fields(#["name"])
@S.action("edit", #{ label: "編集" })
@S.action("changePassword", #{
  label: "パスワード変更",
  ui: #{ icon: "key" },
  dialog: #{ title: "パスワード変更", description: "新しいパスワードを入力してください（8文字以上）" },
  api: #{ path: "/{id}/password", method: "PUT", body: #["password"] }
}, ChangePasswordDialog)
model UserShow {}
