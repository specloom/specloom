import { L as ListView, A as Arrow_left, S as ShowView, F as FormView } from "../../../chunks/arrow-left.js";
const usersData = [
  { id: "1", name: "田中太郎", email: "tanaka@example.com", role: "admin", active: true, createdAt: "2024-01-15" },
  { id: "2", name: "佐藤花子", email: "sato@example.com", role: "editor", active: true, createdAt: "2024-02-20" },
  { id: "3", name: "鈴木一郎", email: "suzuki@example.com", role: "viewer", active: false, createdAt: "2024-03-10" },
  { id: "4", name: "高橋美咲", email: "takahashi@example.com", role: "editor", active: true, createdAt: "2024-04-05" },
  { id: "5", name: "山田健太", email: "yamada@example.com", role: "viewer", active: true, createdAt: "2024-05-12" }
];
const roleOptions = [
  { value: "admin", label: "管理者" },
  { value: "editor", label: "編集者" },
  { value: "viewer", label: "閲覧者" }
];
const usersListVM = {
  type: "list",
  resource: "users",
  label: "ユーザー一覧",
  fields: [
    { name: "name", label: "名前", kind: "text", sortable: true },
    { name: "email", label: "メール", kind: "email", sortable: true },
    { name: "role", label: "権限", kind: "enum", sortable: true, options: roleOptions },
    { name: "active", label: "有効", kind: "boolean" },
    { name: "createdAt", label: "登録日", kind: "date", sortable: true }
  ],
  rows: usersData.map((user) => ({
    id: user.id,
    values: user,
    actions: [
      { id: "edit", label: "編集", allowed: true, ui: { variant: "secondary" } },
      { id: "delete", label: "削除", allowed: true, confirm: "本当に削除しますか？", ui: { variant: "danger" } }
    ]
  })),
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } }
  ],
  bulkActions: [
    { id: "bulk-delete", label: "一括削除", allowed: true, confirm: "選択したユーザーを削除しますか？", ui: { variant: "danger" } },
    { id: "bulk-export", label: "エクスポート", allowed: true }
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["name", "email"], query: "" },
  defaultSort: { field: "createdAt", order: "desc" },
  clickAction: "show"
};
const usersShowVM = {
  type: "show",
  resource: "users",
  label: "ユーザー詳細",
  id: "1",
  fields: [
    { name: "name", label: "名前", kind: "text", value: "田中太郎" },
    { name: "email", label: "メール", kind: "email", value: "tanaka@example.com" },
    { name: "role", label: "権限", kind: "enum", value: "admin", options: roleOptions },
    { name: "active", label: "有効", kind: "boolean", value: true },
    { name: "createdAt", label: "登録日", kind: "date", value: "2024-01-15" }
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    { id: "delete", label: "削除", allowed: true, confirm: "本当に削除しますか？", ui: { variant: "danger" } }
  ],
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active", "createdAt"] }
  ]
};
const usersFormVM = {
  type: "form",
  resource: "users",
  label: "ユーザー編集",
  mode: "edit",
  id: "1",
  fields: [
    { name: "name", label: "名前", kind: "text", value: "田中太郎", required: true, readonly: false, errors: [], placeholder: "名前を入力" },
    { name: "email", label: "メールアドレス", kind: "email", value: "tanaka@example.com", required: true, readonly: false, errors: [], placeholder: "email@example.com" },
    { name: "role", label: "権限", kind: "enum", value: "admin", required: true, readonly: false, errors: [], options: roleOptions },
    { name: "active", label: "有効", kind: "boolean", value: true, required: false, readonly: false, errors: [], hint: "無効にするとログインできなくなります" }
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false,
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "email"] },
    { id: "settings", label: "設定", fields: ["role", "active"] }
  ]
};
function _page($$renderer) {
  let currentView = "list";
  let listVM = usersListVM;
  let showVM = usersShowVM;
  let formVM = usersFormVM;
  function handleSelect(rowId) {
    const selected = listVM.selection.selected.includes(rowId) ? listVM.selection.selected.filter((id) => id !== rowId) : [...listVM.selection.selected, rowId];
    listVM = { ...listVM, selection: { ...listVM.selection, selected } };
  }
  function handleSelectAll() {
    const allSelected = listVM.selection.selected.length === listVM.rows.length;
    listVM = {
      ...listVM,
      selection: {
        ...listVM.selection,
        selected: allSelected ? [] : listVM.rows.map((r) => r.id)
      }
    };
  }
  function handleListAction(actionId, rowIds) {
    if (actionId === "create" || actionId === "edit") {
      currentView = "form";
    }
  }
  function handleShowAction(actionId) {
    if (actionId === "edit") {
      currentView = "form";
    }
  }
  function handleFormAction(actionId) {
    if (actionId === "cancel") {
      currentView = "list";
    }
  }
  function handleFormChange(name, value) {
    formVM = {
      ...formVM,
      isDirty: true,
      fields: formVM.fields.map((f) => f.name === name ? { ...f, value } : f)
    };
  }
  function handleFormSubmit() {
    currentView = "list";
  }
  $$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-foreground">ユーザー管理</h1> <p class="mt-1 text-sm text-muted-foreground">ユーザーアカウントの管理を行います</p></div> `);
  if (currentView !== "list") {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<button class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">`);
    Arrow_left($$renderer, { class: "h-4 w-4" });
    $$renderer.push(`<!----> 一覧に戻る</button>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--></div> <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden">`);
  if (currentView === "list") {
    $$renderer.push("<!--[-->");
    ListView($$renderer, {
      vm: listVM,
      onAction: handleListAction,
      onSelect: handleSelect,
      onSelectAll: handleSelectAll,
      onRowClick: () => currentView = "show"
    });
  } else {
    $$renderer.push("<!--[!-->");
    if (currentView === "show") {
      $$renderer.push("<!--[-->");
      ShowView($$renderer, { vm: showVM, onAction: handleShowAction });
    } else {
      $$renderer.push("<!--[!-->");
      if (currentView === "form") {
        $$renderer.push("<!--[-->");
        FormView($$renderer, {
          vm: formVM,
          onChange: handleFormChange,
          onSubmit: handleFormSubmit,
          onAction: handleFormAction
        });
      } else {
        $$renderer.push("<!--[!-->");
      }
      $$renderer.push(`<!--]-->`);
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
export {
  _page as default
};
