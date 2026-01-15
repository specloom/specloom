import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";

export const productsData = [
  { id: "1", name: "ノートPC", sku: "PC-001", price: 128000, stock: 50, category: "electronics", published: true, url: "https://example.com/pc" },
  { id: "2", name: "ワイヤレスマウス", sku: "MS-002", price: 3980, stock: 200, category: "accessories", published: true, url: "https://example.com/mouse" },
  { id: "3", name: "モニター 27インチ", sku: "MN-003", price: 45000, stock: 30, category: "electronics", published: true, url: "https://example.com/monitor" },
  { id: "4", name: "キーボード", sku: "KB-004", price: 12800, stock: 0, category: "accessories", published: false, url: "" },
  { id: "5", name: "USBハブ", sku: "HB-005", price: 2500, stock: 150, category: "accessories", published: true, url: "https://example.com/hub" },
  { id: "6", name: "外付けSSD 1TB", sku: "SD-006", price: 15800, stock: 80, category: "storage", published: true, url: "https://example.com/ssd" },
];

const categoryOptions = [
  { value: "electronics", label: "電子機器" },
  { value: "accessories", label: "アクセサリー" },
  { value: "storage", label: "ストレージ" },
];

export const productsListVM: ListViewModel = {
  type: "list",
  resource: "products",
  label: "商品一覧",
  fields: [
    { name: "name", label: "商品名", kind: "text", sortable: true },
    { name: "sku", label: "SKU", kind: "text" },
    { name: "price", label: "価格", kind: "currency", sortable: true },
    { name: "stock", label: "在庫", kind: "number", sortable: true },
    { name: "category", label: "カテゴリ", kind: "enum", sortable: true, options: categoryOptions },
    { name: "published", label: "公開", kind: "boolean" },
  ],
  rows: productsData.map((product) => ({
    id: product.id,
    values: product,
    actions: [
      { id: "edit", label: "編集", allowed: true },
      { id: "duplicate", label: "複製", allowed: true },
      { id: "delete", label: "削除", allowed: product.stock === 0, confirm: "本当に削除しますか？", ui: { variant: "danger" } },
    ],
  })),
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } },
    { id: "import", label: "インポート", allowed: true },
  ],
  bulkActions: [
    { id: "bulk-publish", label: "一括公開", allowed: true },
    { id: "bulk-unpublish", label: "一括非公開", allowed: true },
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["name", "sku"], query: "" },
  defaultSort: { field: "name", order: "asc" },
  clickAction: "show",
};

export const productsShowVM: ShowViewModel = {
  type: "show",
  resource: "products",
  label: "商品詳細",
  id: "1",
  fields: [
    { name: "name", label: "商品名", kind: "text", value: "ノートPC" },
    { name: "sku", label: "SKU", kind: "text", value: "PC-001" },
    { name: "price", label: "価格", kind: "currency", value: 128000 },
    { name: "stock", label: "在庫数", kind: "number", value: 50 },
    { name: "category", label: "カテゴリ", kind: "enum", value: "electronics", options: categoryOptions },
    { name: "published", label: "公開状態", kind: "boolean", value: true },
    { name: "url", label: "商品URL", kind: "url", value: "https://example.com/pc" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    { id: "duplicate", label: "複製", allowed: true },
  ],
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "sku", "category"] },
    { id: "pricing", label: "価格・在庫", fields: ["price", "stock"] },
    { id: "publish", label: "公開設定", fields: ["published", "url"] },
  ],
};

export const productsFormVM: FormViewModel = {
  type: "form",
  resource: "products",
  label: "商品編集",
  mode: "edit",
  id: "1",
  fields: [
    { name: "name", label: "商品名", kind: "text", value: "ノートPC", required: true, readonly: false, errors: [], placeholder: "商品名を入力" },
    { name: "sku", label: "SKU", kind: "text", value: "PC-001", required: true, readonly: true, errors: [], hint: "SKUは変更できません" },
    { name: "price", label: "価格", kind: "number", value: 128000, required: true, readonly: false, errors: [], validation: { min: 0 } },
    { name: "stock", label: "在庫数", kind: "number", value: 50, required: true, readonly: false, errors: [], validation: { min: 0 } },
    { name: "category", label: "カテゴリ", kind: "enum", value: "electronics", required: true, readonly: false, errors: [], options: categoryOptions },
    { name: "published", label: "公開", kind: "boolean", value: true, required: false, readonly: false, errors: [] },
    { name: "url", label: "商品URL", kind: "url", value: "https://example.com/pc", required: false, readonly: false, errors: [], placeholder: "https://" },
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false,
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "sku", "category"] },
    { id: "pricing", label: "価格・在庫", fields: ["price", "stock"] },
    { id: "publish", label: "公開設定", fields: ["published", "url"] },
  ],
};
