import { g as getListView, a as getResource, e as evaluateListView, L as ListView, b as ListToolbar, c as ListLoading, d as ListError, f as ListEmpty, h as ListTable, i as ListHeader, j as ListBody, k as ListBulkActions, l as ListHeaderActions } from "../../../chunks/spec.js";
const users = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "鈴木花子",
    email: "suzuki@example.com",
    role: "editor",
    status: "active",
    createdAt: "2024-02-20T14:45:00Z"
  },
  {
    id: "3",
    name: "佐藤次郎",
    email: "sato@example.com",
    role: "viewer",
    status: "inactive",
    createdAt: "2024-03-10T09:15:00Z"
  },
  {
    id: "4",
    name: "山田美咲",
    email: "yamada@example.com",
    role: "editor",
    status: "active",
    createdAt: "2024-04-05T16:20:00Z"
  },
  {
    id: "5",
    name: "高橋健一",
    email: "takahashi@example.com",
    role: "viewer",
    status: "active",
    createdAt: "2024-05-12T11:00:00Z"
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
    const view = getListView("users");
    const resource = getResource("users");
    const vm = (() => {
      const baseVM = evaluateListView({ view, resource, context, data: users, selected: selectedIds });
      return {
        ...baseVM,
        selection: { ...baseVM.selection, selected: selectedIds },
        pagination: { page: 1, pageSize: 10, totalCount: users.length },
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
      if (selectedIds.length === users.length) {
        selectedIds = [];
      } else {
        selectedIds = users.map((u) => u.id);
      }
    }
    function handleAction(actionId, rowIds) {
      console.log("Action:", actionId, "Rows:", rowIds);
      if (actionId === "delete" && rowIds) {
        alert(`削除: ${rowIds.join(", ")}`);
      } else if (actionId === "edit" && rowIds?.[0]) {
        window.location.href = `/users/${rowIds[0]}/edit`;
      } else if (actionId === "create") {
        window.location.href = "/users/new";
      }
    }
    function handleRowClick(rowId) {
      window.location.href = `/users/${rowId}`;
    }
    $$renderer2.push(`<div class="container mx-auto py-8"><div class="mb-6"><a href="/" class="text-sm text-muted-foreground hover:text-foreground">← ホーム</a></div> <h1 class="text-2xl font-bold mb-6">ユーザー一覧</h1> `);
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
