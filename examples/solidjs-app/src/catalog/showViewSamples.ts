import type { ShowViewModel } from "specloom";

// ============================================================
// 基本的な詳細画面
// ============================================================
export const basicShow: ShowViewModel = {
  type: "show",
  resource: "Article",
  label: "記事詳細",
  id: "1",
  fields: [
    { name: "title", label: "タイトル", kind: "text", value: "はじめての記事" },
    { name: "content", label: "本文", kind: "longText", value: "これは記事の本文です。\n\n改行も含まれています。" },
    { name: "status", label: "状態", kind: "enum", value: "published", options: [
      { value: "draft", label: "下書き" },
      { value: "published", label: "公開中" },
    ]},
    { name: "createdAt", label: "作成日", kind: "date", value: "2024-01-15" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true },
    { id: "back", label: "一覧に戻る", allowed: true },
  ],
};

// ============================================================
// 全フィールドタイプ表示
// ============================================================
export const allFieldTypesShow: ShowViewModel = {
  type: "show",
  resource: "Product",
  label: "商品詳細",
  id: "1",
  fields: [
    // テキスト系
    { name: "name", label: "商品名", kind: "text", value: "高性能ノートPC" },
    { name: "description", label: "説明", kind: "longText", value: "最新のプロセッサを搭載した高性能ノートPCです。\n\n軽量で持ち運びにも便利。" },
    { name: "email", label: "問い合わせ", kind: "email", value: "support@example.com" },
    { name: "website", label: "Webサイト", kind: "url", value: "https://example.com/product/1" },
    { name: "phone", label: "電話番号", kind: "tel", value: "03-1234-5678" },
    // 数値系
    { name: "price", label: "価格", kind: "number", value: 150000 },
    { name: "stock", label: "在庫数", kind: "number", value: 25 },
    // Boolean
    { name: "isActive", label: "公開中", kind: "boolean", value: true },
    { name: "isFeatured", label: "おすすめ", kind: "boolean", value: false },
    // Enum / Status
    { name: "category", label: "カテゴリ", kind: "enum", value: "electronics", options: [
      { value: "electronics", label: "電子機器" },
      { value: "clothing", label: "衣類" },
      { value: "food", label: "食品" },
    ]},
    { name: "status", label: "販売状態", kind: "status", value: "available", options: [
      { value: "draft", label: "下書き" },
      { value: "available", label: "販売中" },
      { value: "soldout", label: "売り切れ" },
    ]},
    // 日付系
    { name: "releaseDate", label: "発売日", kind: "date", value: "2024-01-15" },
    { name: "lastUpdated", label: "最終更新", kind: "datetime", value: "2024-02-01T10:30:00Z" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true },
    { id: "duplicate", label: "複製", allowed: true },
    { id: "delete", label: "削除", allowed: true, confirm: "この商品を削除しますか？", ui: { variant: "danger" } },
  ],
};

// ============================================================
// リレーション付き詳細
// ============================================================
export const showWithRelations: ShowViewModel = {
  type: "show",
  resource: "Order",
  label: "注文詳細",
  id: "ORD-001",
  fields: [
    { name: "orderNumber", label: "注文番号", kind: "text", value: "ORD-001" },
    { name: "customer", label: "顧客", kind: "relation", value: { id: "c1", name: "田中商店" }, relation: { resource: "Customer", labelField: "name" } },
    { name: "product", label: "商品", kind: "relation", value: { id: "p1", title: "高性能ノートPC" }, relation: { resource: "Product", labelField: "title" } },
    { name: "quantity", label: "数量", kind: "number", value: 2 },
    { name: "amount", label: "金額", kind: "currency", value: 300000 },
    { name: "status", label: "状態", kind: "status", value: "shipped", options: [
      { value: "pending", label: "保留中" },
      { value: "processing", label: "処理中" },
      { value: "shipped", label: "発送済み" },
      { value: "delivered", label: "配達完了" },
    ]},
    { name: "shippedAt", label: "発送日時", kind: "datetime", value: "2024-01-20T14:30:00Z" },
    { name: "assignedTo", label: "担当者", kind: "relation", value: { id: "u1", name: "鈴木一郎" }, relation: { resource: "User", labelField: "name" } },
  ],
  actions: [
    { id: "updateStatus", label: "ステータス更新", allowed: true },
    { id: "printInvoice", label: "請求書印刷", allowed: true },
    { id: "back", label: "一覧に戻る", allowed: true },
  ],
};

// ============================================================
// アクション制限付き詳細
// ============================================================
export const showWithRestrictedActions: ShowViewModel = {
  type: "show",
  resource: "Article",
  label: "記事詳細（閲覧のみ）",
  id: "1",
  fields: [
    { name: "title", label: "タイトル", kind: "text", value: "公開済み記事" },
    { name: "content", label: "本文", kind: "longText", value: "この記事は公開済みのため、編集できません。" },
    { name: "status", label: "状態", kind: "enum", value: "published", options: [
      { value: "draft", label: "下書き" },
      { value: "published", label: "公開中" },
    ]},
    { name: "author", label: "著者", kind: "relation", value: { id: "u2", name: "山田花子" }, relation: { resource: "User", labelField: "name" } },
    { name: "publishedAt", label: "公開日時", kind: "datetime", value: "2024-01-15T09:00:00Z" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: false },
    { id: "unpublish", label: "非公開にする", allowed: false, confirm: "この記事を非公開にしますか？" },
    { id: "delete", label: "削除", allowed: false, ui: { variant: "danger" } },
    { id: "back", label: "一覧に戻る", allowed: true },
  ],
};

// ============================================================
// null値を含む詳細
// ============================================================
export const showWithNullValues: ShowViewModel = {
  type: "show",
  resource: "User",
  label: "ユーザー詳細",
  id: "3",
  fields: [
    { name: "name", label: "名前", kind: "text", value: "新規ユーザー" },
    { name: "email", label: "メール", kind: "email", value: "newuser@example.com" },
    { name: "phone", label: "電話番号", kind: "tel", value: null },
    { name: "bio", label: "自己紹介", kind: "longText", value: null },
    { name: "department", label: "部署", kind: "relation", value: null, relation: { resource: "Department", labelField: "name" } },
    { name: "joinedAt", label: "入社日", kind: "date", value: null },
    { name: "isVerified", label: "認証済み", kind: "boolean", value: false },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true },
    { id: "verify", label: "認証する", allowed: true, ui: { variant: "primary" } },
  ],
};

// ============================================================
// エクスポート
// ============================================================
export const showViewSamples = {
  basicShow,
  allFieldTypesShow,
  showWithRelations,
  showWithRestrictedActions,
  showWithNullValues,
};
