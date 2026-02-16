import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";

// サンプルユーザーデータ
export const sampleUsers = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    role: "admin",
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    role: "viewer",
    active: false,
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "高橋美咲",
    email: "takahashi@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-04-05",
  },
  {
    id: "5",
    name: "山田健太",
    email: "yamada@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-05-12",
  },
];

// ユーザー一覧 ViewModel
export const usersListVM: ListViewModel = {
  type: "list",
  resource: "users",
  label: "ユーザー一覧",
  fields: [
    { name: "name", label: "名前", kind: "text", sortable: true },
    { name: "email", label: "メール", kind: "email", sortable: true },
    {
      name: "role",
      label: "権限",
      kind: "enum",
      sortable: true,
      options: [
        { value: "admin", label: "管理者" },
        { value: "editor", label: "編集者" },
        { value: "viewer", label: "閲覧者" },
      ],
    },
    { name: "active", label: "有効", kind: "boolean" },
    { name: "createdAt", label: "登録日", kind: "date", sortable: true },
  ],
  rows: sampleUsers.map((user) => ({
    id: user.id,
    values: user,
    actions: [
      {
        id: "edit",
        label: "編集",
        allowed: true,
        ui: { variant: "secondary" },
      },
      {
        id: "delete",
        label: "削除",
        allowed: true,
        confirm: "本当に削除しますか？",
        ui: { variant: "danger" },
      },
    ],
  })),
  pageActions: [
    {
      id: "create",
      label: "新規作成",
      allowed: true,
      ui: { variant: "primary" },
    },
  ],
  bulkActions: [
    {
      id: "bulk-delete",
      label: "一括削除",
      allowed: true,
      confirm: "選択したユーザーを削除しますか？",
      ui: { variant: "danger" },
    },
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["name", "email"], query: "" },
  defaultSort: { field: "createdAt", order: "desc" },
  clickAction: "show",
};

// ユーザー詳細 ViewModel
export const usersShowVM: ShowViewModel = {
  type: "show",
  resource: "users",
  label: "ユーザー詳細",
  id: "1",
  fields: [
    { name: "name", label: "名前", kind: "text", value: "田中太郎" },
    {
      name: "email",
      label: "メール",
      kind: "email",
      value: "tanaka@example.com",
    },
    {
      name: "role",
      label: "権限",
      kind: "enum",
      value: "admin",
      options: [
        { value: "admin", label: "管理者" },
        { value: "editor", label: "編集者" },
        { value: "viewer", label: "閲覧者" },
      ],
    },
    { name: "active", label: "有効", kind: "boolean", value: true },
    { name: "createdAt", label: "登録日", kind: "date", value: "2024-01-15" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    {
      id: "delete",
      label: "削除",
      allowed: true,
      confirm: "本当に削除しますか？",
      ui: { variant: "danger" },
    },
    { id: "back", label: "戻る", allowed: true },
  ],
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active", "createdAt"] },
  ],
};

// ユーザー編集フォーム ViewModel
export const usersFormVM: FormViewModel = {
  type: "form",
  resource: "users",
  label: "ユーザー編集",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "name",
      label: "名前",
      kind: "text",
      value: "田中太郎",
      required: true,
      readonly: false,
      errors: [],
      placeholder: "名前を入力",
    },
    {
      name: "email",
      label: "メールアドレス",
      kind: "email",
      value: "tanaka@example.com",
      required: true,
      readonly: false,
      errors: [],
      placeholder: "email@example.com",
    },
    {
      name: "role",
      label: "権限",
      kind: "enum",
      value: "admin",
      required: true,
      readonly: false,
      errors: [],
      options: [
        { value: "admin", label: "管理者" },
        { value: "editor", label: "編集者" },
        { value: "viewer", label: "閲覧者" },
      ],
    },
    {
      name: "active",
      label: "有効",
      kind: "boolean",
      value: true,
      required: false,
      readonly: false,
      errors: [],
      hint: "無効にするとログインできなくなります",
    },
    {
      name: "bio",
      label: "自己紹介",
      kind: "textarea",
      value: "",
      required: false,
      readonly: false,
      errors: [],
      placeholder: "自己紹介を入力（任意）",
    },
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false,
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active", "bio"] },
  ],
};

// ============================================================
// 投稿データ
// ============================================================

const samplePosts = [
  {
    id: "1",
    title: "はじめての投稿",
    status: "published",
    author: "田中太郎",
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    title: "TypeSpec 入門",
    status: "draft",
    author: "佐藤花子",
    createdAt: "2024-02-15",
  },
  {
    id: "3",
    title: "ViewModel パターン解説",
    status: "published",
    author: "鈴木一郎",
    createdAt: "2024-03-01",
  },
  {
    id: "4",
    title: "管理画面の設計",
    status: "draft",
    author: "高橋美咲",
    createdAt: "2024-04-10",
  },
];

export const postsListVM: ListViewModel = {
  type: "list",
  resource: "posts",
  label: "投稿一覧",
  fields: [
    { name: "title", label: "タイトル", kind: "text", sortable: true },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      sortable: true,
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
    },
    { name: "author", label: "著者", kind: "text" },
    { name: "createdAt", label: "作成日", kind: "date", sortable: true },
  ],
  rows: samplePosts.map((p) => ({
    id: p.id,
    values: p,
    actions: [
      {
        id: "edit",
        label: "編集",
        allowed: true,
        ui: { variant: "secondary" },
      },
      {
        id: "delete",
        label: "削除",
        allowed: true,
        confirm: "本当に削除しますか？",
        ui: { variant: "danger" },
      },
    ],
  })),
  pageActions: [
    {
      id: "create",
      label: "新規作成",
      allowed: true,
      ui: { variant: "primary" },
    },
  ],
  bulkActions: [
    {
      id: "bulk-delete",
      label: "一括削除",
      allowed: true,
      confirm: "選択した投稿を削除しますか？",
      ui: { variant: "danger" },
    },
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["title", "author"], query: "" },
  defaultSort: { field: "createdAt", order: "desc" },
  clickAction: "show",
};

export const postsShowVM: ShowViewModel = {
  type: "show",
  resource: "posts",
  label: "投稿詳細",
  id: "1",
  fields: [
    { name: "title", label: "タイトル", kind: "text", value: "はじめての投稿" },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "published",
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
    },
    { name: "author", label: "著者", kind: "text", value: "田中太郎" },
    { name: "createdAt", label: "作成日", kind: "date", value: "2024-01-20" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    {
      id: "delete",
      label: "削除",
      allowed: true,
      confirm: "本当に削除しますか？",
      ui: { variant: "danger" },
    },
    { id: "back", label: "戻る", allowed: true },
  ],
};

export const postsFormVM: FormViewModel = {
  type: "form",
  resource: "posts",
  label: "投稿編集",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "title",
      label: "タイトル",
      kind: "text",
      value: "はじめての投稿",
      required: true,
      readonly: false,
      errors: [],
      placeholder: "タイトルを入力",
    },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "published",
      required: true,
      readonly: false,
      errors: [],
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
    },
    {
      name: "body",
      label: "本文",
      kind: "textarea",
      value: "",
      required: false,
      readonly: false,
      errors: [],
      placeholder: "本文を入力",
    },
  ],
  actions: [
    { id: "cancel", label: "キャンセル", allowed: true },
    {
      id: "preview",
      label: "プレビュー",
      allowed: true,
      ui: { variant: "secondary" },
    },
  ],
  isValid: true,
  isDirty: false,
};

// ============================================================
// 注文データ
// ============================================================

const sampleOrders = [
  {
    id: "ORD-001",
    customer: "田中太郎",
    total: 12800,
    status: "shipped",
    orderedAt: "2024-03-01",
  },
  {
    id: "ORD-002",
    customer: "佐藤花子",
    total: 5400,
    status: "pending",
    orderedAt: "2024-03-05",
  },
  {
    id: "ORD-003",
    customer: "鈴木一郎",
    total: 32000,
    status: "delivered",
    orderedAt: "2024-02-20",
  },
  {
    id: "ORD-004",
    customer: "高橋美咲",
    total: 8900,
    status: "cancelled",
    orderedAt: "2024-03-10",
  },
];

export const ordersListVM: ListViewModel = {
  type: "list",
  resource: "orders",
  label: "注文一覧",
  fields: [
    { name: "id", label: "注文ID", kind: "text", sortable: true },
    { name: "customer", label: "顧客", kind: "text", sortable: true },
    { name: "total", label: "合計", kind: "currency" },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      sortable: true,
      options: [
        { value: "pending", label: "処理中" },
        { value: "shipped", label: "発送済" },
        { value: "delivered", label: "配達済" },
        { value: "cancelled", label: "キャンセル" },
      ],
    },
    { name: "orderedAt", label: "注文日", kind: "date", sortable: true },
  ],
  rows: sampleOrders.map((o) => ({
    id: o.id,
    values: o,
    actions: [
      {
        id: "view",
        label: "詳細",
        allowed: true,
        ui: { variant: "secondary" },
      },
    ],
  })),
  pageActions: [],
  bulkActions: [],
  filters: {
    named: [
      { id: "all", label: "すべて", active: true },
      {
        id: "pending",
        label: "処理中",
        active: false,
        filter: { field: "status", operator: "eq", value: "pending" },
      },
      {
        id: "shipped",
        label: "発送済",
        active: false,
        filter: { field: "status", operator: "eq", value: "shipped" },
      },
    ],
  },
  selection: { mode: "single", selected: [] },
  search: { fields: ["id", "customer"], query: "" },
  defaultSort: { field: "orderedAt", order: "desc" },
  clickAction: "show",
};

export const ordersShowVM: ShowViewModel = {
  type: "show",
  resource: "orders",
  label: "注文詳細",
  id: "ORD-001",
  fields: [
    { name: "id", label: "注文ID", kind: "text", value: "ORD-001" },
    { name: "customer", label: "顧客", kind: "text", value: "田中太郎" },
    { name: "total", label: "合計", kind: "currency", value: 12800 },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "shipped",
      options: [
        { value: "pending", label: "処理中" },
        { value: "shipped", label: "発送済" },
        { value: "delivered", label: "配達済" },
        { value: "cancelled", label: "キャンセル" },
      ],
    },
    { name: "orderedAt", label: "注文日", kind: "date", value: "2024-03-01" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    { id: "back", label: "戻る", allowed: true },
  ],
};

export const ordersFormVM: FormViewModel = {
  type: "form",
  resource: "orders",
  label: "注文編集",
  mode: "edit",
  id: "ORD-001",
  fields: [
    {
      name: "customer",
      label: "顧客",
      kind: "text",
      value: "田中太郎",
      required: true,
      readonly: true,
      errors: [],
    },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "shipped",
      required: true,
      readonly: false,
      errors: [],
      options: [
        { value: "pending", label: "処理中" },
        { value: "shipped", label: "発送済" },
        { value: "delivered", label: "配達済" },
        { value: "cancelled", label: "キャンセル" },
      ],
    },
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false,
};

// ============================================================
// 商品データ
// ============================================================

const sampleProducts = [
  {
    id: "1",
    name: "ワイヤレスイヤホン",
    price: 12800,
    category: "electronics",
    stock: 45,
    active: true,
  },
  {
    id: "2",
    name: "レザーウォレット",
    price: 8900,
    category: "accessories",
    stock: 120,
    active: true,
  },
  {
    id: "3",
    name: "ランニングシューズ",
    price: 15400,
    category: "footwear",
    stock: 0,
    active: false,
  },
  {
    id: "4",
    name: "コットンTシャツ",
    price: 3200,
    category: "apparel",
    stock: 200,
    active: true,
  },
  {
    id: "5",
    name: "ステンレスボトル",
    price: 4500,
    category: "accessories",
    stock: 80,
    active: true,
  },
];

export const productsListVM: ListViewModel = {
  type: "list",
  resource: "products",
  label: "商品一覧",
  fields: [
    { name: "name", label: "商品名", kind: "text", sortable: true },
    { name: "price", label: "価格", kind: "currency", sortable: true },
    {
      name: "category",
      label: "カテゴリ",
      kind: "enum",
      sortable: true,
      options: [
        { value: "electronics", label: "家電" },
        { value: "accessories", label: "アクセサリー" },
        { value: "footwear", label: "シューズ" },
        { value: "apparel", label: "アパレル" },
      ],
    },
    { name: "stock", label: "在庫", kind: "integer" },
    { name: "active", label: "販売中", kind: "boolean" },
  ],
  rows: sampleProducts.map((p) => ({
    id: p.id,
    values: p,
    actions: [
      {
        id: "edit",
        label: "編集",
        allowed: true,
        ui: { variant: "secondary" },
      },
      {
        id: "delete",
        label: "削除",
        allowed: true,
        confirm: "本当に削除しますか？",
        ui: { variant: "danger" },
      },
    ],
  })),
  pageActions: [
    {
      id: "create",
      label: "新規追加",
      allowed: true,
      ui: { variant: "primary" },
    },
  ],
  bulkActions: [
    {
      id: "bulk-delete",
      label: "一括削除",
      allowed: true,
      confirm: "選択した商品を削除しますか？",
      ui: { variant: "danger" },
    },
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["name"], query: "" },
  defaultSort: { field: "name", order: "asc" },
  clickAction: "show",
};

export const productsShowVM: ShowViewModel = {
  type: "show",
  resource: "products",
  label: "商品詳細",
  id: "1",
  fields: [
    {
      name: "name",
      label: "商品名",
      kind: "text",
      value: "ワイヤレスイヤホン",
    },
    { name: "price", label: "価格", kind: "currency", value: 12800 },
    {
      name: "category",
      label: "カテゴリ",
      kind: "enum",
      value: "electronics",
      options: [
        { value: "electronics", label: "家電" },
        { value: "accessories", label: "アクセサリー" },
        { value: "footwear", label: "シューズ" },
        { value: "apparel", label: "アパレル" },
      ],
    },
    { name: "stock", label: "在庫", kind: "integer", value: 45 },
    { name: "active", label: "販売中", kind: "boolean", value: true },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    {
      id: "delete",
      label: "削除",
      allowed: true,
      confirm: "本当に削除しますか？",
      ui: { variant: "danger" },
    },
    { id: "back", label: "戻る", allowed: true },
  ],
};

export const productsFormVM: FormViewModel = {
  type: "form",
  resource: "products",
  label: "商品編集",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "name",
      label: "商品名",
      kind: "text",
      value: "ワイヤレスイヤホン",
      required: true,
      readonly: false,
      errors: [],
      placeholder: "商品名を入力",
    },
    {
      name: "price",
      label: "価格",
      kind: "number",
      value: 12800,
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "category",
      label: "カテゴリ",
      kind: "enum",
      value: "electronics",
      required: true,
      readonly: false,
      errors: [],
      options: [
        { value: "electronics", label: "家電" },
        { value: "accessories", label: "アクセサリー" },
        { value: "footwear", label: "シューズ" },
        { value: "apparel", label: "アパレル" },
      ],
    },
    {
      name: "stock",
      label: "在庫数",
      kind: "integer",
      value: 45,
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "active",
      label: "販売中",
      kind: "boolean",
      value: true,
      required: false,
      readonly: false,
      errors: [],
    },
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false,
};
