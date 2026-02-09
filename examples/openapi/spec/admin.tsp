import "./models.tsp";

// ============================================================
// Admin UI ビュー定義
// @specloom/typespec エミッターが処理 → admin spec JSON
// ============================================================

@S.view(Post, "list")
@S.columns(#["title", "status", "author", "createdAt"])
@S.searchable(#["title"])
@S.sortable(#["title", "createdAt"])
@S.defaultSort("createdAt", "desc")
@S.selection("multi")
@S.clickAction("show")
model PostList {
  @S.action("create")
  @S.label("新規作成")
  @S.allowedWhen("role == 'admin' || role == 'editor'")
  @S.ui(#{ icon: "plus", variant: "primary" })
  create: never;

  @S.rowAction("edit")
  @S.label("編集")
  @S.ui(#{ icon: "pencil" })
  edit: never;

  @S.rowAction("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}

@S.view(Post, "form")
@S.fields(#["title", "body", "status", "author"])
model PostForm {
  @S.action("save")
  @S.label("保存")
  @S.ui(#{ icon: "check", variant: "primary" })
  save: never;

  @S.action("cancel")
  @S.label("キャンセル")
  cancel: never;
}

@S.view(Post, "show")
@S.fields(#["title", "body", "status", "author", "createdAt"])
model PostShow {
  @S.action("edit")
  @S.label("編集")
  @S.ui(#{ icon: "pencil" })
  edit: never;

  @S.action("delete")
  @S.label("削除")
  @S.allowedWhen("role == 'admin'")
  @S.confirm("本当に削除しますか？")
  @S.ui(#{ icon: "trash", variant: "danger" })
  delete: never;
}
