import { L as ListView, A as Arrow_left, S as ShowView, F as FormView } from "../../../chunks/arrow-left.js";
const ordersData = [
  { id: "ORD-001", customer: "田中太郎", email: "tanaka@example.com", total: 156e3, status: "completed", createdAt: "2024-12-01T10:30:00" },
  { id: "ORD-002", customer: "佐藤花子", email: "sato@example.com", total: 3980, status: "shipped", createdAt: "2024-12-05T14:20:00" },
  { id: "ORD-003", customer: "鈴木一郎", email: "suzuki@example.com", total: 45e3, status: "processing", createdAt: "2024-12-10T09:15:00" },
  { id: "ORD-004", customer: "高橋美咲", email: "takahashi@example.com", total: 18300, status: "pending", createdAt: "2024-12-12T16:45:00" },
  { id: "ORD-005", customer: "山田健太", email: "yamada@example.com", total: 128e3, status: "cancelled", createdAt: "2024-12-08T11:00:00" }
];
const statusOptions = [
  { value: "pending", label: "保留中" },
  { value: "processing", label: "処理中" },
  { value: "shipped", label: "発送済み" },
  { value: "completed", label: "完了" },
  { value: "cancelled", label: "キャンセル" }
];
const ordersListVM = {
  type: "list",
  resource: "orders",
  label: "注文一覧",
  fields: [
    { name: "id", label: "注文ID", kind: "text", sortable: true },
    { name: "customer", label: "顧客名", kind: "text", sortable: true },
    { name: "email", label: "メール", kind: "email" },
    { name: "total", label: "合計金額", kind: "currency", sortable: true },
    { name: "status", label: "ステータス", kind: "enum", sortable: true, options: statusOptions },
    { name: "createdAt", label: "注文日時", kind: "datetime", sortable: true }
  ],
  rows: ordersData.map((order) => ({
    id: order.id,
    values: order,
    actions: [
      { id: "view", label: "詳細", allowed: true },
      { id: "cancel", label: "キャンセル", allowed: order.status === "pending" || order.status === "processing", confirm: "注文をキャンセルしますか？", ui: { variant: "danger" } }
    ]
  })),
  headerActions: [
    { id: "export", label: "エクスポート", allowed: true }
  ],
  bulkActions: [],
  filters: { named: [] },
  selection: { mode: "single", selected: [] },
  search: { fields: ["id", "customer", "email"], query: "" },
  defaultSort: { field: "createdAt", order: "desc" },
  clickAction: "show"
};
const ordersShowVM = {
  type: "show",
  resource: "orders",
  label: "注文詳細",
  id: "ORD-001",
  fields: [
    { name: "id", label: "注文ID", kind: "text", value: "ORD-001" },
    { name: "customer", label: "顧客名", kind: "text", value: "田中太郎" },
    { name: "email", label: "メールアドレス", kind: "email", value: "tanaka@example.com" },
    { name: "total", label: "合計金額", kind: "currency", value: 156e3 },
    { name: "status", label: "ステータス", kind: "enum", value: "completed", options: statusOptions },
    { name: "createdAt", label: "注文日時", kind: "datetime", value: "2024-12-01T10:30:00" }
  ],
  actions: [
    { id: "print", label: "印刷", allowed: true },
    { id: "refund", label: "返金", allowed: true, confirm: "返金処理を行いますか？", ui: { variant: "danger" } }
  ],
  groups: [
    { id: "order", label: "注文情報", fields: ["id", "status", "createdAt"] },
    { id: "customer", label: "顧客情報", fields: ["customer", "email"] },
    { id: "payment", label: "支払い", fields: ["total"] }
  ]
};
const ordersFormVM = {
  type: "form",
  resource: "orders",
  label: "注文ステータス更新",
  mode: "edit",
  id: "ORD-003",
  fields: [
    { name: "id", label: "注文ID", kind: "text", value: "ORD-003", required: true, readonly: true, errors: [] },
    { name: "status", label: "ステータス", kind: "enum", value: "processing", required: true, readonly: false, errors: [], options: statusOptions },
    { name: "note", label: "備考", kind: "textarea", value: "", required: false, readonly: false, errors: [], placeholder: "内部メモを入力" }
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false
};
function _page($$renderer) {
  let currentView = "list";
  let listVM = ordersListVM;
  let showVM = ordersShowVM;
  let formVM = ordersFormVM;
  function handleSelect(rowId) {
    listVM = {
      ...listVM,
      selection: { ...listVM.selection, selected: [rowId] }
    };
  }
  function handleListAction(actionId, rowIds) {
    if (actionId === "view") {
      currentView = "show";
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
  $$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-foreground">注文管理</h1> <p class="mt-1 text-sm text-muted-foreground">注文の一覧と詳細を管理します</p></div> `);
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
