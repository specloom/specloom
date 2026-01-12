import "../lib/main.tsp";

// ============================================================
// Models (Resources)
// ============================================================

@Specloom.resource
@Specloom.label("ユーザー")
model User {
  @Specloom.readonly
  id: string;

  @Specloom.label("名前")
  @Specloom.required
  name: string;
}

@Specloom.resource
@Specloom.label("タグ")
model Tag {
  @Specloom.readonly
  id: string;

  @Specloom.label("タグ名")
  @Specloom.required
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

@Specloom.resource
@Specloom.label("投稿")
model Post {
  @Specloom.readonly
  id: string;

  @Specloom.label("タイトル")
  @Specloom.kind("text")
  @Specloom.required
  @Specloom.maxLength(100)
  title: string;

  @Specloom.label("本文")
  @Specloom.kind("longText")
  @Specloom.ui(#{ inputHint: "richtext" })
  body: string;

  // パターン1: TypeSpec enum 型（options 自動生成）
  @Specloom.label("状態")
  @Specloom.kind("enum")
  @Specloom.ui(#{ hint: "badge", inputHint: "select" })
  status: PostStatus;

  // パターン2: TypeSpec enum 型（options 自動生成）
  @Specloom.label("優先度")
  @Specloom.kind("enum")
  priority: Priority;

  // パターン3: TypeSpec enum + @options でラベルをカスタマイズ
  // （enum から options 自動生成されるが、@options で上書きして日本語ラベルを指定）
  @Specloom.label("カテゴリ")
  @Specloom.kind("enum")
  @Specloom.options(#[
    #{ value: "tech", label: "テクノロジー" },
    #{ value: "life", label: "ライフスタイル" },
    #{ value: "news", label: "ニュース" }
  ])
  category: Category;

  @Specloom.label("著者")
  @Specloom.kind("relation")
  @Specloom.relation(User, #{ labelField: "name" })
  @Specloom.ui(#{ hint: "avatar", inputHint: "autocomplete" })
  @Specloom.required
  author: User;

  @Specloom.label("タグ")
  @Specloom.kind("relation")
  @Specloom.relation(Tag, #{ labelField: "name" })
  @Specloom.minItems(1)
  @Specloom.maxItems(5)
  tags: Tag[];

  @Specloom.label("作成日時")
  @Specloom.kind("datetime")
  @Specloom.readonly
  createdAt: utcDateTime;
}

// ============================================================
// Views
// ============================================================

@Specloom.view(Post, "list")
@Specloom.columns(#["title", "status", "author", "createdAt"])
@Specloom.searchable(#["title"])
@Specloom.sortable(#["title", "createdAt"])
@Specloom.defaultSort("createdAt", "desc")
@Specloom.selection("multi")
@Specloom.clickAction("show")
model PostList {
  @Specloom.action("create")
  @Specloom.label("新規作成")
  @Specloom.placement("header")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @Specloom.action("edit")
  @Specloom.label("編集")
  @Specloom.placement("row")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "pencil" })
  edit: never;

  @Specloom.action("delete")
  @Specloom.label("削除")
  @Specloom.placement("row")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("本当に削除しますか？")
  @Specloom.ui(#{ icon: "trash", variant: "danger" })
  delete: never;

  @Specloom.action("bulkDelete")
  @Specloom.label("一括削除")
  @Specloom.placement("bulk")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("選択した項目を削除しますか？")
  bulkDelete: never;
}

@Specloom.view(Post, "form")
@Specloom.fields(#["title", "body", "status", "priority", "category", "author", "tags"])
model PostForm {
  @Specloom.action("save")
  @Specloom.label("保存")
  @Specloom.placement("header")
  @Specloom.ui(#{ icon: "check", variant: "primary" })
  save: never;

  @Specloom.action("cancel")
  @Specloom.label("キャンセル")
  @Specloom.placement("header")
  cancel: never;
}

@Specloom.view(Post, "show")
@Specloom.fields(#["title", "body", "status", "priority", "category", "author", "tags", "createdAt"])
model PostShow {
  @Specloom.action("edit")
  @Specloom.label("編集")
  @Specloom.placement("header")
  @Specloom.allowedWhen("role == 'admin' || role == 'editor'")
  @Specloom.ui(#{ icon: "pencil" })
  edit: never;

  @Specloom.action("delete")
  @Specloom.label("削除")
  @Specloom.placement("header")
  @Specloom.allowedWhen("role == 'admin'")
  @Specloom.confirm("本当に削除しますか？")
  @Specloom.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
