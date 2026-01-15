import type { ListViewModel } from "specloom";

// ============================================================
// 基本的な一覧
// ============================================================
export const basicList: ListViewModel = {
  type: "list",
  resource: "Article",
  label: "記事一覧（基本）",
  fields: [
    { name: "title", label: "タイトル", kind: "text", sortable: true },
    { name: "status", label: "状態", kind: "enum", options: [
      { value: "draft", label: "下書き" },
      { value: "published", label: "公開中" },
    ]},
    { name: "createdAt", label: "作成日", kind: "date", sortable: true },
  ],
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } },
  ],
  bulkActions: [],
  rows: [
    {
      id: "1",
      values: { title: "はじめての記事", status: "published", createdAt: "2024-01-15" },
      actions: [
        { id: "edit", label: "編集", allowed: true },
        { id: "delete", label: "削除", allowed: true, confirm: "削除しますか？", ui: { variant: "danger" } },
      ],
    },
    {
      id: "2",
      values: { title: "下書き記事", status: "draft", createdAt: "2024-01-20" },
      actions: [
        { id: "edit", label: "編集", allowed: true },
        { id: "delete", label: "削除", allowed: false, ui: { variant: "danger" } },
      ],
    },
  ],
  filters: { named: [] },
  selection: { mode: "none", selected: [] },
  search: { fields: [], query: "" },
};

// ============================================================
// フィルター付き一覧
// ============================================================
export const listWithFilters: ListViewModel = {
  type: "list",
  resource: "Article",
  label: "記事一覧（フィルター付き）",
  fields: [
    { name: "title", label: "タイトル", kind: "text", sortable: true },
    { name: "status", label: "状態", kind: "enum", options: [
      { value: "draft", label: "下書き" },
      { value: "published", label: "公開中" },
      { value: "archived", label: "アーカイブ" },
    ]},
  ],
  headerActions: [],
  bulkActions: [],
  rows: [
    { id: "1", values: { title: "公開記事1", status: "published" }, actions: [] },
    { id: "2", values: { title: "下書き記事", status: "draft" }, actions: [] },
    { id: "3", values: { title: "アーカイブ記事", status: "archived" }, actions: [] },
  ],
  filters: {
    named: [
      { id: "all", label: "すべて", active: true },
      { id: "published", label: "公開中", active: false },
      { id: "draft", label: "下書き", active: false },
      { id: "archived", label: "アーカイブ", active: false },
    ],
  },
  selection: { mode: "none", selected: [] },
  search: { fields: ["title"], query: "" },
};

// ============================================================
// 一括選択対応一覧
// ============================================================
export const listWithBulkActions: ListViewModel = {
  type: "list",
  resource: "User",
  label: "ユーザー一覧（一括操作）",
  fields: [
    { name: "name", label: "名前", kind: "text" },
    { name: "email", label: "メール", kind: "email" },
    { name: "role", label: "役割", kind: "enum", options: [
      { value: "admin", label: "管理者" },
      { value: "editor", label: "編集者" },
      { value: "viewer", label: "閲覧者" },
    ]},
    { name: "active", label: "有効", kind: "boolean" },
  ],
  headerActions: [
    { id: "create", label: "ユーザー追加", allowed: true, ui: { variant: "primary" } },
  ],
  bulkActions: [
    { id: "activate", label: "有効化", allowed: true },
    { id: "deactivate", label: "無効化", allowed: true },
    { id: "bulkDelete", label: "一括削除", allowed: true, confirm: "選択したユーザーを削除しますか？", ui: { variant: "danger" } },
  ],
  rows: [
    { id: "1", values: { name: "田中太郎", email: "tanaka@example.com", role: "admin", active: true }, actions: [] },
    { id: "2", values: { name: "山田花子", email: "yamada@example.com", role: "editor", active: true }, actions: [] },
    { id: "3", values: { name: "鈴木一郎", email: "suzuki@example.com", role: "viewer", active: false }, actions: [] },
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["name", "email"], query: "" },
};

// ============================================================
// リレーション付き一覧
// ============================================================
export const listWithRelations: ListViewModel = {
  type: "list",
  resource: "Order",
  label: "注文一覧（リレーション）",
  fields: [
    { name: "orderNumber", label: "注文番号", kind: "text" },
    { name: "customer", label: "顧客", kind: "relation", relation: { resource: "Customer", labelField: "name" } },
    { name: "product", label: "商品", kind: "relation", relation: { resource: "Product", labelField: "title" } },
    { name: "amount", label: "金額", kind: "currency" },
    { name: "status", label: "状態", kind: "status", options: [
      { value: "pending", label: "保留中" },
      { value: "processing", label: "処理中" },
      { value: "shipped", label: "発送済み" },
      { value: "delivered", label: "配達完了" },
    ]},
  ],
  headerActions: [],
  bulkActions: [],
  rows: [
    {
      id: "1",
      values: {
        orderNumber: "ORD-001",
        customer: { id: "c1", name: "田中商店" },
        product: { id: "p1", title: "ノートPC" },
        amount: 150000,
        status: "delivered",
      },
      actions: [{ id: "view", label: "詳細", allowed: true }],
    },
    {
      id: "2",
      values: {
        orderNumber: "ORD-002",
        customer: { id: "c2", name: "山田工業" },
        product: { id: "p2", title: "モニター" },
        amount: 45000,
        status: "processing",
      },
      actions: [{ id: "view", label: "詳細", allowed: true }],
    },
  ],
  filters: { named: [] },
  selection: { mode: "none", selected: [] },
  search: { fields: [], query: "" },
};

// ============================================================
// 空の一覧
// ============================================================
export const emptyList: ListViewModel = {
  type: "list",
  resource: "Article",
  label: "記事一覧（空）",
  fields: [
    { name: "title", label: "タイトル", kind: "text" },
    { name: "status", label: "状態", kind: "enum", options: [] },
  ],
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } },
  ],
  bulkActions: [],
  rows: [],
  filters: { named: [] },
  selection: { mode: "none", selected: [] },
  search: { fields: [], query: "" },
};

// ============================================================
// エクスポート
// ============================================================
export const listViewSamples = {
  basicList,
  listWithFilters,
  listWithBulkActions,
  listWithRelations,
  emptyList,
};
