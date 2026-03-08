import "@specloom/typespec";

// ============================================================
// 共通マスターモデル
// ============================================================

@S.resource
@S.label("都道府県")
model Prefecture {
  @S.readonly
  id: int32;

  @S.label("名前")
  @S.required
  name: string;

  @S.label("コード")
  @S.required
  @S.pattern("^[0-9]{2}$")
  code: string;
}

@S.resource
@S.label("タグ")
model Tag {
  @S.readonly
  id: int32;

  @S.label("タグ名")
  @S.required
  @S.maxLength(30)
  name: string;

  @S.label("スラッグ")
  @S.required
  @S.pattern("slug")
  slug: string;

  @S.label("色")
  @S.kind("text")
  @S.ui(#{ hint: "color" })
  color: string;
}

@S.resource
@S.label("カテゴリ")
model Category {
  @S.readonly
  id: string;

  @S.label("カテゴリ名")
  @S.required
  name: string;

  @S.label("アイコン")
  icon: string;
}

@S.resource
@S.label("商品")
model Product {
  @S.readonly
  id: string;

  @S.label("商品名")
  @S.required
  name: string;

  @S.label("価格")
  @S.kind("currency")
  @S.ui(#{ format: "currency" })
  @S.required
  @S.min(0)
  price: int32;

  @S.label("在庫")
  @S.kind("number")
  @S.min(0)
  stock: int32;
}
