import "@specloom/typespec";

// ============================================================
// 共有モデル定義
// admin spec と OpenAPI の両方から参照される
// ============================================================

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
}

enum PostStatus {
  draft,
  published,
  archived,
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

  @S.label("状態")
  @S.kind("enum")
  @S.options(#[
    #{ value: "draft", label: "下書き" },
    #{ value: "published", label: "公開中" },
    #{ value: "archived", label: "アーカイブ" }
  ])
  status: PostStatus;

  @S.label("著者")
  @S.kind("relation")
  @S.relation(User, #{ labelField: "name" })
  @S.required
  author: User;

  @S.label("作成日時")
  @S.kind("datetime")
  @S.readonly
  createdAt: utcDateTime;
}
