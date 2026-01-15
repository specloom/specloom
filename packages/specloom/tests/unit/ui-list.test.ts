import { describe, it, expect } from "vitest";
import { ListVM } from "../../src/ui/list.js";
import type { ListViewModel, ListFieldVM, RowVM } from "../../src/ui/types.js";

// テスト用のListViewModelを作成
const createListVM = (overrides?: Partial<ListViewModel>): ListViewModel => ({
  type: "list",
  resource: "Post",
  label: "投稿",
  fields: [
    { name: "id", label: "ID", kind: "text" },
    { name: "title", label: "タイトル", kind: "text", sortable: true },
    {
      name: "status",
      label: "ステータス",
      kind: "enum",
      sortable: true,
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開" },
      ],
    },
    {
      name: "author",
      label: "著者",
      kind: "relation",
      relation: { resource: "User", labelField: "name" },
    },
  ],
  headerActions: [
    { id: "create", label: "新規作成", allowed: true },
  ],
  bulkActions: [
    { id: "delete", label: "削除", allowed: true, confirm: "削除しますか？" },
  ],
  rows: [
    {
      id: "1",
      values: { id: "1", title: "記事1", status: "draft", author: { id: "u1", name: "田中" } },
      actions: [{ id: "edit", label: "編集", allowed: true }],
    },
    {
      id: "2",
      values: { id: "2", title: "記事2", status: "published", author: { id: "u2", name: "鈴木" } },
      actions: [{ id: "edit", label: "編集", allowed: true }],
    },
  ],
  filters: {
    named: [
      { id: "all", label: "すべて", active: true },
      { id: "draft", label: "下書き", active: false },
    ],
  },
  selection: { mode: "multi", selected: ["1"] },
  search: { fields: ["title"], query: "記事" },
  defaultSort: { field: "title", order: "asc" },
  pagination: { page: 1, pageSize: 10, totalCount: 25 },
  ...overrides,
});

describe("ListVM", () => {
  describe("フィールド操作", () => {
    it("fields でフィールド一覧を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.fields(vm)).toHaveLength(4);
    });

    it("field で特定のフィールドを取得できる", () => {
      const vm = createListVM();
      const field = ListVM.field(vm, "title");
      expect(field?.name).toBe("title");
      expect(field?.label).toBe("タイトル");
    });

    it("field で存在しないフィールドは undefined", () => {
      const vm = createListVM();
      expect(ListVM.field(vm, "nonexistent")).toBeUndefined();
    });

    it("sortable でソート可能か判定できる", () => {
      const vm = createListVM();
      expect(ListVM.sortable(vm, "title")).toBe(true);
      expect(ListVM.sortable(vm, "id")).toBe(false);
    });
  });

  describe("ソート操作", () => {
    it("sortField で現在のソートフィールドを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.sortField(vm)).toBe("title");
    });

    it("sortField でソートがない場合は null", () => {
      const vm = createListVM({ defaultSort: undefined });
      expect(ListVM.sortField(vm)).toBeNull();
    });

    it("sortOrder でソート順を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.sortOrder(vm, "title")).toBe("asc");
      expect(ListVM.sortOrder(vm, "status")).toBeNull();
    });

    it("sortIcon でアイコンを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.sortIcon(vm, "title")).toBe("↑");

      const vmDesc = createListVM({ defaultSort: { field: "title", order: "desc" } });
      expect(ListVM.sortIcon(vmDesc, "title")).toBe("↓");

      expect(ListVM.sortIcon(vm, "status")).toBe("⇅");
    });
  });

  describe("検索操作", () => {
    it("searchable で検索可能か判定できる", () => {
      const vm = createListVM();
      expect(ListVM.searchable(vm)).toBe(true);

      const vmNoSearch = createListVM({ search: { fields: [], query: "" } });
      expect(ListVM.searchable(vmNoSearch)).toBe(false);
    });

    it("searchQuery で検索クエリを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.searchQuery(vm)).toBe("記事");
    });

    it("searchFields で検索対象フィールドを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.searchFields(vm)).toEqual(["title"]);
    });
  });

  describe("選択操作", () => {
    it("selectable で選択可能か判定できる", () => {
      const vm = createListVM();
      expect(ListVM.selectable(vm)).toBe(true);

      const vmNone = createListVM({ selection: { mode: "none", selected: [] } });
      expect(ListVM.selectable(vmNone)).toBe(false);
    });

    it("multiSelect で複数選択か判定できる", () => {
      const vm = createListVM();
      expect(ListVM.multiSelect(vm)).toBe(true);

      const vmSingle = createListVM({ selection: { mode: "single", selected: [] } });
      expect(ListVM.multiSelect(vmSingle)).toBe(false);
    });

    it("selected で行が選択中か判定できる", () => {
      const vm = createListVM();
      expect(ListVM.selected(vm, "1")).toBe(true);
      expect(ListVM.selected(vm, "2")).toBe(false);
    });

    it("allSelected で全選択か判定できる", () => {
      const vm = createListVM({ selection: { mode: "multi", selected: ["1", "2"] } });
      expect(ListVM.allSelected(vm)).toBe(true);

      const vmPartial = createListVM();
      expect(ListVM.allSelected(vmPartial)).toBe(false);
    });

    it("selectedIds で選択中ID一覧を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.selectedIds(vm)).toEqual(["1"]);
    });

    it("selectedCount で選択数を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.selectedCount(vm)).toBe(1);
    });

    it("selectedRows で選択中の行データを取得できる", () => {
      const vm = createListVM();
      const rows = ListVM.selectedRows(vm);
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe("1");
    });
  });

  describe("フィルター操作", () => {
    it("filters でフィルター一覧を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.filters(vm)).toHaveLength(2);
    });

    it("activeFilters でアクティブなフィルターを取得できる", () => {
      const vm = createListVM();
      const active = ListVM.activeFilters(vm);
      expect(active).toHaveLength(1);
      expect(active[0].id).toBe("all");
    });

    it("filterActive でフィルターがアクティブか判定できる", () => {
      const vm = createListVM();
      expect(ListVM.filterActive(vm, "all")).toBe(true);
      expect(ListVM.filterActive(vm, "draft")).toBe(false);
    });
  });

  describe("ページネーション操作", () => {
    it("page で現在ページを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.page(vm)).toBe(1);
    });

    it("pageSize でページサイズを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.pageSize(vm)).toBe(10);
    });

    it("total で総件数を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.total(vm)).toBe(25);
    });

    it("totalPages で総ページ数を計算できる", () => {
      const vm = createListVM();
      expect(ListVM.totalPages(vm)).toBe(3);
    });

    it("hasNext で次ページがあるか判定できる", () => {
      const vm = createListVM();
      expect(ListVM.hasNext(vm)).toBe(true);

      const vmLastPage = createListVM({
        pagination: { page: 3, pageSize: 10, totalCount: 25 },
      });
      expect(ListVM.hasNext(vmLastPage)).toBe(false);
    });

    it("hasPrev で前ページがあるか判定できる", () => {
      const vm = createListVM();
      expect(ListVM.hasPrev(vm)).toBe(false);

      const vmPage2 = createListVM({
        pagination: { page: 2, pageSize: 10, totalCount: 25 },
      });
      expect(ListVM.hasPrev(vmPage2)).toBe(true);
    });
  });

  describe("アクション操作", () => {
    it("headerActions でヘッダーアクションを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.headerActions(vm)).toHaveLength(1);
      expect(ListVM.headerActions(vm)[0].id).toBe("create");
    });

    it("bulkActions でバルクアクションを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.bulkActions(vm)).toHaveLength(1);
      expect(ListVM.bulkActions(vm)[0].id).toBe("delete");
    });

    it("rowActions で行アクションを取得できる", () => {
      const vm = createListVM();
      const actions = ListVM.rowActions(vm.rows[0]);
      expect(actions).toHaveLength(1);
      expect(actions[0].id).toBe("edit");
    });

    it("allowedActions で許可されたアクションのみ取得できる", () => {
      const actions = [
        { id: "edit", label: "編集", allowed: true },
        { id: "delete", label: "削除", allowed: false },
      ];
      const allowed = ListVM.allowedActions(actions);
      expect(allowed).toHaveLength(1);
      expect(allowed[0].id).toBe("edit");
    });
  });

  describe("行操作", () => {
    it("rows で全行を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.rows(vm)).toHaveLength(2);
    });

    it("row で特定の行を取得できる", () => {
      const vm = createListVM();
      const row = ListVM.row(vm, "1");
      expect(row?.id).toBe("1");
    });

    it("rowCount で行数を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.rowCount(vm)).toBe(2);
    });

    it("empty で空か判定できる", () => {
      const vm = createListVM();
      expect(ListVM.empty(vm)).toBe(false);

      const vmEmpty = createListVM({ rows: [] });
      expect(ListVM.empty(vmEmpty)).toBe(true);
    });
  });

  describe("セル操作", () => {
    it("cellValue でセルの値を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.cellValue(vm.rows[0], "title")).toBe("記事1");
    });

    it("formatCell でセルをフォーマットできる", () => {
      const vm = createListVM();
      const titleField = ListVM.field(vm, "title")!;
      expect(ListVM.formatCell(titleField, "テスト")).toBe("テスト");
    });

    it("formatCell で enum をラベルに変換できる", () => {
      const vm = createListVM();
      const statusField = ListVM.field(vm, "status")!;
      expect(ListVM.formatCell(statusField, "draft")).toBe("下書き");
      expect(ListVM.formatCell(statusField, "published")).toBe("公開");
    });

    it("formatCell で relation をラベルに変換できる", () => {
      const vm = createListVM();
      const authorField = ListVM.field(vm, "author")!;
      expect(ListVM.formatCell(authorField, { id: "u1", name: "田中" })).toBe("田中");
    });

    it("formatCell で null/undefined は - を返す", () => {
      const vm = createListVM();
      const titleField = ListVM.field(vm, "title")!;
      expect(ListVM.formatCell(titleField, null)).toBe("-");
      expect(ListVM.formatCell(titleField, undefined)).toBe("-");
    });
  });

  describe("状態操作", () => {
    it("loading で読み込み中か判定できる", () => {
      const vm = createListVM();
      expect(ListVM.loading(vm)).toBe(false);

      const vmLoading = createListVM({ isLoading: true });
      expect(ListVM.loading(vmLoading)).toBe(true);
    });

    it("error でエラーメッセージを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.error(vm)).toBeUndefined();

      const vmError = createListVM({ error: "データ取得に失敗しました" });
      expect(ListVM.error(vmError)).toBe("データ取得に失敗しました");
    });
  });

  describe("メタ情報", () => {
    it("label でラベルを取得できる", () => {
      const vm = createListVM();
      expect(ListVM.label(vm)).toBe("投稿");
    });

    it("resource でリソース名を取得できる", () => {
      const vm = createListVM();
      expect(ListVM.resource(vm)).toBe("Post");
    });

    it("clickAction でクリックアクションを取得できる", () => {
      const vm = createListVM({ clickAction: "show" });
      expect(ListVM.clickAction(vm)).toBe("show");
    });
  });
});
