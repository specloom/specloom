import "./common.tsp";

// ============================================================
// ブログ投稿管理
// 網羅: enum (複数パターン), relation (Model型/スカラー型),
//       @filter (演算子あり/なし), @namedFilters (複合条件),
//       @searchable, @sortable, @defaultSort,
//       @selection("multi"), @clickAction,
//       @ui(inputHint: "richtext"/"autocomplete"/"select"),
//       @ui(hint: "badge"/"avatar"/"link"),
//       bulk action (selection: "selected"/"query"),
//       @minItems, @maxItems, @maxLength
// ============================================================

enum PostStatus {
  draft,
  review,
  published,
  archived,
}

enum Priority {
  low,
  medium,
  high,
  urgent,
}

@S.resource
@S.label("投稿")
model Post {
  @S.readonly
  id: string;

  @S.label("タイトル")
  @S.kind("text")
  @S.required
  @S.maxLength(200)
  @S.filter(#["contains", "starts_with"])
  title: string;

  @S.label("スラッグ")
  @S.kind("text")
  @S.required
  @S.pattern("slug")
  @S.maxLength(100)
  slug: string;

  @S.label("本文")
  @S.kind("longText")
  @S.ui(#{ inputHint: "richtext" })
  body: string;

  @S.label("抜粋")
  @S.kind("longText")
  @S.maxLength(300)
  @S.ui(#{ inputHint: "multiline" })
  excerpt: string;

  // enum: ステータス（badge表示、select入力）
  @S.label("ステータス")
  @S.kind("status")
  @S.required
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "review", label: "レビュー中" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  @S.ui(#{ hint: "badge", inputHint: "select" })
  @S.filter(#["eq", "in", "ne"])
  status: PostStatus;

  // enum: 優先度（radio入力）
  @S.label("優先度")
  @S.kind("enum")
  @S.options(#[
    #{ value: "low", label: "低" },
    #{ value: "medium", label: "中" },
    #{ value: "high", label: "高" },
    #{ value: "urgent", label: "緊急" }
  ])
  @S.ui(#{ inputHint: "radio" })
  @S.filter(#["eq", "in"])
  priority: Priority;

  // relation: Model型 → オブジェクトそのまま送信
  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name", searchable: true })
  @S.required
  @S.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @S.filter(#["eq"])
  author: User;

  // relation: スカラー型 → ID 抽出して送信
  @S.label("カテゴリ")
  @S.kind("relation")
  @S.relation(Category, #{ labelField: "name" })
  @S.required
  @S.filter(#["eq", "in"])
  category_id: string;

  // relation: Model配列 → オブジェクト配列そのまま送信
  @S.label("タグ")
  @S.kind("relation")
  @S.relation(Tag, #{ labelField: "name", searchable: true })
  @S.minItems(1)
  @S.maxItems(10)
  @S.filter(#["has_any"])
  tags: Tag[];

  // relation: スカラー配列 → ID 配列で送信
  @S.label("関連投稿ID")
  @S.kind("relation")
  @S.relation(Post, #{ labelField: "title" })
  @S.maxItems(5)
  relatedPostIds: string[];

  @S.label("公開")
  @S.kind("boolean")
  @S.ui(#{ inputHint: "switch" })
  @S.filter(#["eq"])
  isPublic: boolean;

  @S.label("サムネイル")
  @S.kind("image")
  thumbnail: string;

  @S.label("公開日")
  @S.kind("date")
  @S.filter(#["gte", "lte"])
  publishedAt: plainDate;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  @S.ui(#{ format: "relative" })
  @S.filter(#["gte", "lte"])
  createdAt: utcDateTime;

  @S.label("更新日時")
  @S.kind("datetime")
  @S.readonly
  @S.ui(#{ format: "relative" })
  updatedAt: utcDateTime;

  @S.label("閲覧数")
  @S.kind("number")
  @S.readonly
  @S.computed
  viewCount: int32;
}

// ============================================================
// Views
// ============================================================

@S.view(Post, "list")
@S.columns(#["title", "status", "priority", "author", "category_id", "publishedAt", "viewCount"])
@S.searchable(#["title", "body"])
@S.sortable(#["title", "publishedAt", "createdAt", "viewCount"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
// namedFilters: 複合条件を含む
@S.namedFilter("drafts", "下書き", #{ field: "status", operator: "eq", value: "draft" })
@S.namedFilter("published", "公開中", #{
  and: #[
    #{ field: "status", operator: "eq", value: "published" },
    #{ field: "isPublic", operator: "eq", value: true }
  ]
})
@S.namedFilter("myPosts", "自分の投稿", #{ field: "author.id", operator: "eq", value: "@context.user.id" })
@S.namedFilter("thisMonth", "今月", #{ field: "createdAt", operator: "gte", value: "@relative(startOfMonth)" })
@S.namedFilter("highPriority", "高優先度", #{
  or: #[
    #{ field: "priority", operator: "eq", value: "high" },
    #{ field: "priority", operator: "eq", value: "urgent" }
  ]
})
@S.action("create", #{
  label: "新規作成",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "plus", variant: "primary" }
})
// bulk action: 選択した行が対象
@S.action("bulkPublish", #{
  label: "一括公開",
  selection: "selected",
  allowedWhen: "role == 'admin' || role == 'editor'",
  confirm: "選択した投稿を公開しますか？",
  ui: #{ icon: "globe" }
})
// bulk action: フィルター条件の全件が対象
@S.action("bulkArchive", #{
  label: "一括アーカイブ",
  selection: "query",
  allowedWhen: "role == 'admin'",
  confirm: "フィルター条件に一致する全投稿をアーカイブしますか？",
  ui: #{ icon: "archive", variant: "warning" }
})
@S.action("bulkDelete", #{
  label: "一括削除",
  selection: "selected",
  allowedWhen: "role == 'admin'",
  confirm: true,
  ui: #{ icon: "trash", variant: "danger" }
})
@S.rowAction("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.rowAction("show", #{
  label: "詳細",
  ui: #{ icon: "eye", variant: "ghost" }
})
@S.rowAction("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "この投稿を削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
model PostList {}

@S.view(Post, "form")
@S.fields(#["title", "slug", "body", "excerpt", "status", "priority", "author", "category_id", "tags", "relatedPostIds", "isPublic", "thumbnail", "publishedAt"])
@S.action("save", #{
  label: "保存",
  ui: #{ icon: "check", variant: "primary" }
})
@S.action("saveDraft", #{
  label: "下書き保存",
  ui: #{ icon: "archive", variant: "secondary" }
})
@S.action("cancel", #{ label: "キャンセル" })
model PostForm {}

@S.view(Post, "show")
@S.fields(#["title", "slug", "body", "excerpt", "status", "priority", "author", "category_id", "tags", "relatedPostIds", "isPublic", "thumbnail", "publishedAt", "createdAt", "updatedAt", "viewCount"])
@S.action("edit", #{
  label: "編集",
  allowedWhen: "role == 'admin' || role == 'editor'",
  ui: #{ icon: "pencil" }
})
@S.action("publish", #{
  label: "公開",
  allowedWhen: "role == 'admin' || role == 'editor'",
  confirm: "この投稿を公開しますか？",
  ui: #{ icon: "globe", variant: "primary" },
  api: #{ path: "/{id}/publish", method: "POST" }
})
@S.action("delete", #{
  label: "削除",
  allowedWhen: "role == 'admin'",
  confirm: "この投稿を完全に削除しますか？",
  ui: #{ icon: "trash", variant: "danger" }
})
model PostShow {}
