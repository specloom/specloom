import type { FormViewModel } from "specloom";

// ============================================================
// 新規作成フォーム
// ============================================================
export const createForm: FormViewModel = {
  type: "form",
  resource: "Article",
  label: "記事",
  mode: "create",
  fields: [
    {
      name: "title",
      label: "タイトル",
      kind: "text",
      value: "",
      required: true,
      readonly: false,
      validation: { minLength: 1, maxLength: 100 },
      errors: [],
    },
    {
      name: "content",
      label: "本文",
      kind: "longText",
      value: "",
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "draft",
      required: true,
      readonly: false,
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
      errors: [],
    },
  ],
  actions: [
    { id: "save", label: "保存", allowed: true, ui: { variant: "primary" } },
    { id: "cancel", label: "キャンセル", allowed: true },
  ],
  isValid: true,
  isDirty: false,
};

// ============================================================
// 編集フォーム
// ============================================================
export const editForm: FormViewModel = {
  type: "form",
  resource: "Article",
  label: "記事",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "title",
      label: "タイトル",
      kind: "text",
      value: "はじめての記事",
      required: true,
      readonly: false,
      validation: { maxLength: 100 },
      errors: [],
    },
    {
      name: "content",
      label: "本文",
      kind: "longText",
      value: "これは記事の本文です。\n\n複数行のテキストを入力できます。",
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "published",
      required: true,
      readonly: false,
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
      errors: [],
    },
  ],
  actions: [
    { id: "save", label: "保存", allowed: true, ui: { variant: "primary" } },
    { id: "cancel", label: "キャンセル", allowed: true },
  ],
  isValid: true,
  isDirty: false,
};

// ============================================================
// バリデーションエラーありフォーム
// ============================================================
export const formWithErrors: FormViewModel = {
  type: "form",
  resource: "Article",
  label: "記事",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "title",
      label: "タイトル",
      kind: "text",
      value: "",
      required: true,
      readonly: false,
      validation: { minLength: 1, maxLength: 100 },
      errors: ["タイトルは必須です"],
    },
    {
      name: "content",
      label: "本文",
      kind: "longText",
      value: "短い",
      required: true,
      readonly: false,
      validation: { minLength: 10 },
      errors: ["本文は10文字以上必要です"],
    },
    {
      name: "email",
      label: "連絡先メール",
      kind: "email",
      value: "invalid-email",
      required: true,
      readonly: false,
      errors: ["有効なメールアドレスを入力してください"],
    },
  ],
  actions: [
    { id: "save", label: "保存", allowed: false, ui: { variant: "primary" } },
    { id: "cancel", label: "キャンセル", allowed: true },
  ],
  isValid: false,
  isDirty: true,
};

// ============================================================
// 全フィールドタイプフォーム
// ============================================================
export const allFieldTypesForm: FormViewModel = {
  type: "form",
  resource: "Product",
  label: "商品",
  mode: "edit",
  id: "1",
  fields: [
    // テキスト系
    {
      name: "name",
      label: "商品名",
      kind: "text",
      value: "サンプル商品",
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "description",
      label: "説明",
      kind: "longText",
      value: "これは商品の説明文です。",
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "email",
      label: "問い合わせメール",
      kind: "email",
      value: "contact@example.com",
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "website",
      label: "Webサイト",
      kind: "url",
      value: "https://example.com",
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "phone",
      label: "電話番号",
      kind: "tel",
      value: "03-1234-5678",
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "password",
      label: "管理パスワード",
      kind: "password",
      value: "secret123",
      required: false,
      readonly: false,
      errors: [],
    },
    // 数値系
    {
      name: "price",
      label: "価格",
      kind: "number",
      value: 1500,
      required: true,
      readonly: false,
      validation: { min: 0, max: 1000000 },
      errors: [],
    },
    {
      name: "stock",
      label: "在庫数",
      kind: "number",
      value: 50,
      required: false,
      readonly: false,
      errors: [],
    },
    // Boolean
    {
      name: "isActive",
      label: "公開中",
      kind: "boolean",
      value: true,
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "isFeatured",
      label: "おすすめ",
      kind: "boolean",
      value: false,
      required: false,
      readonly: false,
      errors: [],
    },
    // Enum
    {
      name: "category",
      label: "カテゴリ",
      kind: "enum",
      value: "electronics",
      required: true,
      readonly: false,
      options: [
        { value: "electronics", label: "電子機器" },
        { value: "clothing", label: "衣類" },
        { value: "food", label: "食品" },
        { value: "other", label: "その他" },
      ],
      errors: [],
    },
    {
      name: "status",
      label: "状態",
      kind: "status",
      value: "available",
      required: true,
      readonly: false,
      options: [
        { value: "draft", label: "下書き" },
        { value: "available", label: "販売中" },
        { value: "soldout", label: "売り切れ" },
        { value: "discontinued", label: "販売終了" },
      ],
      errors: [],
    },
    // 読み取り専用
    {
      name: "createdAt",
      label: "作成日",
      kind: "text",
      value: "2024-01-15",
      required: false,
      readonly: true,
      errors: [],
    },
  ],
  actions: [
    { id: "save", label: "保存", allowed: true, ui: { variant: "primary" } },
    { id: "preview", label: "プレビュー", allowed: true },
    { id: "cancel", label: "キャンセル", allowed: true },
  ],
  isValid: true,
  isDirty: false,
};

// ============================================================
// 読み取り専用フォーム
// ============================================================
export const readonlyForm: FormViewModel = {
  type: "form",
  resource: "Order",
  label: "注文",
  mode: "edit",
  id: "ORD-001",
  fields: [
    {
      name: "orderNumber",
      label: "注文番号",
      kind: "text",
      value: "ORD-001",
      required: false,
      readonly: true,
      errors: [],
    },
    {
      name: "customerName",
      label: "顧客名",
      kind: "text",
      value: "田中商店",
      required: false,
      readonly: true,
      errors: [],
    },
    {
      name: "amount",
      label: "金額",
      kind: "number",
      value: 150000,
      required: false,
      readonly: true,
      errors: [],
    },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "delivered",
      required: false,
      readonly: true,
      options: [
        { value: "pending", label: "保留中" },
        { value: "processing", label: "処理中" },
        { value: "shipped", label: "発送済み" },
        { value: "delivered", label: "配達完了" },
      ],
      errors: [],
    },
  ],
  actions: [
    { id: "back", label: "戻る", allowed: true },
  ],
  isValid: true,
  isDirty: false,
};

// ============================================================
// エクスポート
// ============================================================
export const formViewSamples = {
  createForm,
  editForm,
  formWithErrors,
  allFieldTypesForm,
  readonlyForm,
};
