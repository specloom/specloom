import { L as ListView, A as Arrow_left, S as ShowView, F as FormView } from "../../../chunks/arrow-left.js";
const productsData = [
  { id: "1", name: "ノートPC", sku: "PC-001", price: 128e3, stock: 50, category: "electronics", published: true, url: "https://example.com/pc" },
  { id: "2", name: "ワイヤレスマウス", sku: "MS-002", price: 3980, stock: 200, category: "accessories", published: true, url: "https://example.com/mouse" },
  { id: "3", name: "モニター 27インチ", sku: "MN-003", price: 45e3, stock: 30, category: "electronics", published: true, url: "https://example.com/monitor" },
  { id: "4", name: "キーボード", sku: "KB-004", price: 12800, stock: 0, category: "accessories", published: false, url: "" },
  { id: "5", name: "USBハブ", sku: "HB-005", price: 2500, stock: 150, category: "accessories", published: true, url: "https://example.com/hub" },
  { id: "6", name: "外付けSSD 1TB", sku: "SD-006", price: 15800, stock: 80, category: "storage", published: true, url: "https://example.com/ssd" }
];
const categoryOptions = [
  { value: "electronics", label: "電子機器" },
  { value: "accessories", label: "アクセサリー" },
  { value: "storage", label: "ストレージ" }
];
const productsListVM = {
  type: "list",
  resource: "products",
  label: "商品一覧",
  fields: [
    { name: "name", label: "商品名", kind: "text", sortable: true },
    { name: "sku", label: "SKU", kind: "text" },
    { name: "price", label: "価格", kind: "currency", sortable: true },
    { name: "stock", label: "在庫", kind: "number", sortable: true },
    { name: "category", label: "カテゴリ", kind: "enum", sortable: true, options: categoryOptions },
    { name: "published", label: "公開", kind: "boolean" }
  ],
  rows: productsData.map((product) => ({
    id: product.id,
    values: product,
    actions: [
      { id: "edit", label: "編集", allowed: true },
      { id: "duplicate", label: "複製", allowed: true },
      { id: "delete", label: "削除", allowed: product.stock === 0, confirm: "本当に削除しますか？", ui: { variant: "danger" } }
    ]
  })),
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } },
    { id: "import", label: "インポート", allowed: true }
  ],
  bulkActions: [
    { id: "bulk-publish", label: "一括公開", allowed: true },
    { id: "bulk-unpublish", label: "一括非公開", allowed: true }
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["name", "sku"], query: "" },
  defaultSort: { field: "name", order: "asc" },
  clickAction: "show"
};
const productsShowVM = {
  type: "show",
  resource: "products",
  label: "商品詳細",
  id: "1",
  fields: [
    { name: "name", label: "商品名", kind: "text", value: "ノートPC" },
    { name: "sku", label: "SKU", kind: "text", value: "PC-001" },
    { name: "price", label: "価格", kind: "currency", value: 128e3 },
    { name: "stock", label: "在庫数", kind: "number", value: 50 },
    { name: "category", label: "カテゴリ", kind: "enum", value: "electronics", options: categoryOptions },
    { name: "published", label: "公開状態", kind: "boolean", value: true },
    { name: "url", label: "商品URL", kind: "url", value: "https://example.com/pc" }
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    { id: "duplicate", label: "複製", allowed: true }
  ],
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "sku", "category"] },
    { id: "pricing", label: "価格・在庫", fields: ["price", "stock"] },
    { id: "publish", label: "公開設定", fields: ["published", "url"] }
  ]
};
const productsFormVM = {
  type: "form",
  resource: "products",
  label: "商品編集",
  mode: "edit",
  id: "1",
  fields: [
    { name: "name", label: "商品名", kind: "text", value: "ノートPC", required: true, readonly: false, errors: [], placeholder: "商品名を入力" },
    { name: "sku", label: "SKU", kind: "text", value: "PC-001", required: true, readonly: true, errors: [], hint: "SKUは変更できません" },
    { name: "price", label: "価格", kind: "number", value: 128e3, required: true, readonly: false, errors: [], validation: { min: 0 } },
    { name: "stock", label: "在庫数", kind: "number", value: 50, required: true, readonly: false, errors: [], validation: { min: 0 } },
    { name: "category", label: "カテゴリ", kind: "enum", value: "electronics", required: true, readonly: false, errors: [], options: categoryOptions },
    { name: "published", label: "公開", kind: "boolean", value: true, required: false, readonly: false, errors: [] },
    { name: "url", label: "商品URL", kind: "url", value: "https://example.com/pc", required: false, readonly: false, errors: [], placeholder: "https://" }
  ],
  actions: [{ id: "cancel", label: "キャンセル", allowed: true }],
  isValid: true,
  isDirty: false,
  groups: [
    { id: "basic", label: "基本情報", fields: ["name", "sku", "category"] },
    { id: "pricing", label: "価格・在庫", fields: ["price", "stock"] },
    { id: "publish", label: "公開設定", fields: ["published", "url"] }
  ]
};
function _page($$renderer) {
  let currentView = "list";
  let listVM = productsListVM;
  let showVM = productsShowVM;
  let formVM = productsFormVM;
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
  $$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-foreground">商品管理</h1> <p class="mt-1 text-sm text-muted-foreground">商品情報の管理を行います</p></div> `);
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
