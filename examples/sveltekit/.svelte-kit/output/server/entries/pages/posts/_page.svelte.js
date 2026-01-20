import { L as ListView, A as Arrow_left, S as ShowView, F as FormView } from "../../../chunks/arrow-left.js";
const postsData = [
  { id: "1", title: "SvelteKitの始め方", slug: "getting-started-sveltekit", author: "田中太郎", category: "tech", published: true, publishedAt: "2024-11-15", views: 1250 },
  { id: "2", title: "TypeScript 5.0 新機能まとめ", slug: "typescript-5-features", author: "佐藤花子", category: "tech", published: true, publishedAt: "2024-10-20", views: 3420 },
  { id: "3", title: "効率的なコードレビューの方法", slug: "effective-code-review", author: "鈴木一郎", category: "process", published: false, publishedAt: null, views: 0 },
  { id: "4", title: "チームビルディングのコツ", slug: "team-building-tips", author: "高橋美咲", category: "management", published: true, publishedAt: "2024-12-01", views: 890 }
];
const categoryOptions = [
  { value: "tech", label: "技術" },
  { value: "process", label: "プロセス" },
  { value: "management", label: "マネジメント" },
  { value: "news", label: "ニュース" }
];
const postsListVM = {
  type: "list",
  resource: "posts",
  label: "記事一覧",
  fields: [
    { name: "title", label: "タイトル", kind: "text", sortable: true },
    { name: "author", label: "著者", kind: "text", sortable: true },
    { name: "category", label: "カテゴリ", kind: "enum", sortable: true, options: categoryOptions },
    { name: "published", label: "公開", kind: "boolean" },
    { name: "publishedAt", label: "公開日", kind: "date", sortable: true },
    { name: "views", label: "閲覧数", kind: "number", sortable: true }
  ],
  rows: postsData.map((post) => ({
    id: post.id,
    values: post,
    actions: [
      { id: "edit", label: "編集", allowed: true },
      { id: "preview", label: "プレビュー", allowed: true },
      { id: "publish", label: "公開", allowed: !post.published },
      { id: "unpublish", label: "非公開", allowed: post.published, confirm: "非公開にしますか？" }
    ]
  })),
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } }
  ],
  bulkActions: [
    { id: "bulk-publish", label: "一括公開", allowed: true },
    { id: "bulk-delete", label: "一括削除", allowed: true, confirm: "選択した記事を削除しますか？", ui: { variant: "danger" } }
  ],
  filters: { named: [] },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["title", "author"], query: "" },
  defaultSort: { field: "publishedAt", order: "desc" },
  clickAction: "show"
};
const postsShowVM = {
  type: "show",
  resource: "posts",
  label: "記事詳細",
  id: "1",
  fields: [
    { name: "title", label: "タイトル", kind: "text", value: "SvelteKitの始め方" },
    { name: "slug", label: "スラッグ", kind: "text", value: "getting-started-sveltekit" },
    { name: "author", label: "著者", kind: "text", value: "田中太郎" },
    { name: "category", label: "カテゴリ", kind: "enum", value: "tech", options: categoryOptions },
    { name: "published", label: "公開状態", kind: "boolean", value: true },
    { name: "publishedAt", label: "公開日", kind: "date", value: "2024-11-15" },
    { name: "views", label: "閲覧数", kind: "number", value: 1250 }
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true, ui: { variant: "primary" } },
    { id: "preview", label: "プレビュー", allowed: true }
  ]
};
const postsFormVM = {
  type: "form",
  resource: "posts",
  label: "記事編集",
  mode: "edit",
  id: "1",
  fields: [
    { name: "title", label: "タイトル", kind: "text", value: "SvelteKitの始め方", required: true, readonly: false, errors: [], placeholder: "記事タイトル" },
    { name: "slug", label: "スラッグ", kind: "text", value: "getting-started-sveltekit", required: true, readonly: false, errors: [], hint: "URLに使用されます（英数字とハイフンのみ）" },
    { name: "category", label: "カテゴリ", kind: "enum", value: "tech", required: true, readonly: false, errors: [], options: categoryOptions },
    { name: "content", label: "本文", kind: "textarea", value: "# SvelteKitとは\n\nSvelteKitは...", required: true, readonly: false, errors: [], placeholder: "Markdown形式で入力" },
    { name: "published", label: "公開する", kind: "boolean", value: true, required: false, readonly: false, errors: [] }
  ],
  actions: [
    { id: "preview", label: "プレビュー", allowed: true },
    { id: "cancel", label: "キャンセル", allowed: true }
  ],
  isValid: true,
  isDirty: false
};
function _page($$renderer) {
  let currentView = "list";
  let listVM = postsListVM;
  let showVM = postsShowVM;
  let formVM = postsFormVM;
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
  $$renderer.push(`<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-semibold text-foreground">投稿管理</h1> <p class="mt-1 text-sm text-muted-foreground">ブログ記事の作成・編集を行います</p></div> `);
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
