import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";

// サンプルユーザーデータ
export const sampleUsers = [
  { id: "1", name: "田中太郎", email: "tanaka@example.com", role: "admin", active: true, createdAt: "2024-01-15" },
  { id: "2", name: "佐藤花子", email: "sato@example.com", role: "editor", active: true, createdAt: "2024-02-20" },
  { id: "3", name: "鈴木一郎", email: "suzuki@example.com", role: "viewer", active: false, createdAt: "2024-03-10" },
  { id: "4", name: "高橋美咲", email: "takahashi@example.com", role: "editor", active: true, createdAt: "2024-04-05" },
  { id: "5", name: "山田健太", email: "yamada@example.com", role: "viewer", active: true, createdAt: "2024-05-12" },
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
      { id: "edit", label: "編集", allowed: true, ui: { variant: "secondary" } },
      { id: "delete", label: "削除", allowed: true, confirm: "本当に削除しますか？", ui: { variant: "danger" } },
    ],
  })),
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } },
  ],
  bulkActions: [
    { id: "bulk-delete", label: "一括削除", allowed: true, confirm: "選択したユーザーを削除しますか？", ui: { variant: "danger" } },
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["name", "email"], query: "" },
  defaultSort: { field: "createdAt", order: "desc" },
  clickAction: "show",
};

// ユーザー詳細 ViewModel
export const userShowVM: ShowViewModel = {
  type: "show",
  resource: "users",
  label: "ユーザー詳細",
  id: "1",
  fields: [
    { name: "name", label: "名前", kind: "text", value: "田中太郎" },
    { name: "email", label: "メール", kind: "email", value: "tanaka@example.com" },
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
    { id: "delete", label: "削除", allowed: true, confirm: "本当に削除しますか？", ui: { variant: "danger" } },
    { id: "back", label: "戻る", allowed: true },
  ],
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active", "createdAt"] },
  ],
};

// ユーザー編集フォーム ViewModel
export const userFormVM: FormViewModel = {
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
  actions: [
    { id: "cancel", label: "キャンセル", allowed: true },
  ],
  isValid: true,
  isDirty: false,
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active", "bio"] },
  ],
};
