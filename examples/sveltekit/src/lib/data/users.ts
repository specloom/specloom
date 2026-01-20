import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";

export const usersData = [
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
  {
    id: "6",
    name: "伊藤裕子",
    email: "ito@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-05-18",
  },
  {
    id: "7",
    name: "渡辺大輔",
    email: "watanabe@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-06-01",
  },
  {
    id: "8",
    name: "中村愛",
    email: "nakamura@example.com",
    role: "admin",
    active: true,
    createdAt: "2024-06-10",
  },
  {
    id: "9",
    name: "小林誠",
    email: "kobayashi@example.com",
    role: "viewer",
    active: false,
    createdAt: "2024-06-15",
  },
  {
    id: "10",
    name: "加藤美穂",
    email: "kato@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-06-20",
  },
  {
    id: "11",
    name: "吉田隆",
    email: "yoshida@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-07-01",
  },
  {
    id: "12",
    name: "山本さくら",
    email: "yamamoto@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-07-08",
  },
  {
    id: "13",
    name: "松本浩二",
    email: "matsumoto@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-07-15",
  },
  {
    id: "14",
    name: "井上真理",
    email: "inoue@example.com",
    role: "admin",
    active: false,
    createdAt: "2024-07-20",
  },
  {
    id: "15",
    name: "木村拓也",
    email: "kimura@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-07-25",
  },
  {
    id: "16",
    name: "林由美",
    email: "hayashi@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-08-01",
  },
  {
    id: "17",
    name: "清水健一",
    email: "shimizu@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-08-05",
  },
  {
    id: "18",
    name: "森田恵",
    email: "morita@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-08-10",
  },
  {
    id: "19",
    name: "阿部直人",
    email: "abe@example.com",
    role: "viewer",
    active: false,
    createdAt: "2024-08-15",
  },
  {
    id: "20",
    name: "池田香織",
    email: "ikeda@example.com",
    role: "admin",
    active: true,
    createdAt: "2024-08-20",
  },
  {
    id: "21",
    name: "橋本翔",
    email: "hashimoto@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-08-25",
  },
  {
    id: "22",
    name: "石川麻衣",
    email: "ishikawa@example.com",
    role: "editor",
    active: true,
    createdAt: "2024-09-01",
  },
  {
    id: "23",
    name: "前田雄太",
    email: "maeda@example.com",
    role: "viewer",
    active: true,
    createdAt: "2024-09-05",
  },
];

const roleOptions = [
  { value: "admin", label: "管理者" },
  { value: "editor", label: "編集者" },
  { value: "viewer", label: "閲覧者" },
];

const PAGE_SIZE = 5;

function toRow(user: (typeof usersData)[number]) {
  return {
    id: user.id,
    values: user,
    actions: [
      {
        id: "edit",
        label: "編集",
        allowed: true,
        ui: { variant: "secondary" as const },
      },
      {
        id: "delete",
        label: "削除",
        allowed: true,
        confirm: "本当に削除しますか？",
        ui: { variant: "danger" as const },
      },
    ],
  };
}

export function createUsersListVM(page: number = 1): ListViewModel {
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageData = usersData.slice(startIndex, startIndex + PAGE_SIZE);

  return {
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
        options: roleOptions,
      },
      { name: "active", label: "有効", kind: "boolean" },
      { name: "createdAt", label: "登録日", kind: "date", sortable: true },
    ],
    rows: pageData.map(toRow),
    headerActions: [
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
      { id: "bulk-export", label: "エクスポート", allowed: true },
    ],
    filters: {
      named: [
        { id: "active", label: "有効のみ", active: false },
        { id: "admin", label: "管理者", active: false },
        { id: "editor", label: "編集者", active: false },
      ],
    },
    selection: { mode: "multi", selected: [] },
    search: { fields: ["name", "email"], query: "" },
    defaultSort: { field: "createdAt", order: "desc" },
    clickAction: "show",
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      totalCount: usersData.length,
    },
  };
}

export const usersListVM: ListViewModel = createUsersListVM(1);

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
      options: roleOptions,
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
  ],
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active", "createdAt"] },
  ],
};

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
      options: roleOptions,
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
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false,
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active"] },
  ],
};
