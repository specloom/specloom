import { g as getListView, a as getResource, e as evaluateListView, L as ListView, b as ListToolbar, c as ListLoading, d as ListError, f as ListEmpty, h as ListTable, i as ListHeader, j as ListBody, k as ListBulkActions, l as ListHeaderActions } from "../../../chunks/spec.js";
const posts = [
  {
    id: "1",
    title: "はじめてのブログ記事",
    content: "これは最初のブログ記事です。specloomを使って管理画面を構築しています。",
    status: "published",
    authorId: "1",
    publishedAt: "2024-01-20T12:00:00Z",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Svelte 5の新機能",
    content: "Svelte 5では$state、$derived、$effectなどのrunesが導入されました。",
    status: "published",
    authorId: "2",
    publishedAt: "2024-02-25T09:00:00Z",
    createdAt: "2024-02-20T14:00:00Z"
  },
  {
    id: "3",
    title: "下書き記事",
    content: "この記事はまだ下書き状態です。",
    status: "draft",
    authorId: "1",
    publishedAt: null,
    createdAt: "2024-03-15T16:30:00Z"
  },
  {
    id: "4",
    title: "アーカイブされた記事",
    content: "この記事はアーカイブされています。",
    status: "archived",
    authorId: "4",
    publishedAt: "2023-12-01T10:00:00Z",
    createdAt: "2023-11-20T08:00:00Z"
  }
];
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const context = {
      user: { id: "1", role: "admin" },
      role: "admin",
      permissions: [],
      custom: {}
    };
    let selectedIds = [];
    let sortField = "createdAt";
    let sortDir = "desc";
    const view = getListView("posts");
    const resource = getResource("posts");
    const vm = (() => {
      const baseVM = evaluateListView({ view, resource, context, data: posts, selected: selectedIds });
      return {
        ...baseVM,
        selection: { ...baseVM.selection, selected: selectedIds },
        pagination: { page: 1, pageSize: 10, totalCount: posts.length },
        defaultSort: { field: sortField, order: sortDir }
      };
    })();
    function handleSort(field) {
      if (sortField === field) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortField = field;
        sortDir = "asc";
      }
    }
    function handleSelect(rowId) {
      if (selectedIds.includes(rowId)) {
        selectedIds = selectedIds.filter((id) => id !== rowId);
      } else {
        selectedIds = [...selectedIds, rowId];
      }
    }
    function handleSelectAll() {
      if (selectedIds.length === posts.length) {
        selectedIds = [];
      } else {
        selectedIds = posts.map((p) => p.id);
      }
    }
    function handleAction(actionId, rowIds) {
      console.log("Action:", actionId, "Rows:", rowIds);
      if (actionId === "delete" && rowIds) {
        alert(`削除: ${rowIds.join(", ")}`);
      } else if (actionId === "edit" && rowIds?.[0]) {
        window.location.href = `/posts/${rowIds[0]}/edit`;
      } else if (actionId === "create") {
        window.location.href = "/posts/new";
      }
    }
    function handleRowClick(rowId) {
      window.location.href = `/posts/${rowId}`;
    }
    $$renderer2.push(`<div class="container mx-auto py-8"><div class="mb-6"><a href="/" class="text-sm text-muted-foreground hover:text-foreground">← ホーム</a></div> <h1 class="text-2xl font-bold mb-6">記事一覧</h1> `);
    ListView($$renderer2, {
      vm,
      onSort: handleSort,
      onSelect: handleSelect,
      onSelectAll: handleSelectAll,
      onAction: handleAction,
      onRowClick: handleRowClick,
      children: ($$renderer3) => {
        {
          let children = function($$renderer4) {
            ListBulkActions($$renderer4, {});
            $$renderer4.push(`<!----> `);
            ListHeaderActions($$renderer4, {});
            $$renderer4.push(`<!---->`);
          };
          ListToolbar($$renderer3, { children });
        }
        $$renderer3.push(`<!----> `);
        ListLoading($$renderer3, {});
        $$renderer3.push(`<!----> `);
        ListError($$renderer3, {});
        $$renderer3.push(`<!----> `);
        ListEmpty($$renderer3, {});
        $$renderer3.push(`<!----> `);
        ListTable($$renderer3, {
          children: ($$renderer4) => {
            ListHeader($$renderer4, {});
            $$renderer4.push(`<!----> `);
            ListBody($$renderer4, {});
            $$renderer4.push(`<!---->`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};
