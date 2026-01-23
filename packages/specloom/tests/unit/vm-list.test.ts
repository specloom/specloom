import { describe, it, expect } from "vitest";
import { ListVM } from "../../src/vm/list.js";
import type { ListViewModel, ListFieldVM, RowVM } from "../../src/vm/types.js";

// テスト用のListViewModelを作成
const createListVMData = (
  overrides?: Partial<ListViewModel>,
): ListViewModel => ({
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
  pageActions: [{ id: "create", label: "新規作成", allowed: true }],
  bulkActions: [
    { id: "delete", label: "削除", allowed: true, confirm: "削除しますか？" },
  ],
  rows: [
    {
      id: "1",
      values: {
        id: "1",
        title: "記事1",
        status: "draft",
        author: { id: "u1", name: "田中" },
      },
      actions: [{ id: "edit", label: "編集", allowed: true }],
    },
    {
      id: "2",
      values: {
        id: "2",
        title: "記事2",
        status: "published",
        author: { id: "u2", name: "鈴木" },
      },
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

// ヘルパー: ListVM インスタンスを作成
const createListVM = (overrides?: Partial<ListViewModel>): ListVM =>
  new ListVM(createListVMData(overrides));

describe("ListVM (OOP Style)", () => {
  describe("Static Factory", () => {
    it("ListVM.from で作成できる", () => {
      const data = createListVMData();
      const vm = ListVM.from(data);
      expect(vm).toBeInstanceOf(ListVM);
      expect(vm.data).toBe(data);
    });
  });

  describe("フィールド操作", () => {
    it("fields でフィールド一覧を取得できる", () => {
      const vm = createListVM();
      expect(vm.fields).toHaveLength(4);
    });

    it("field で特定のフィールドを取得できる", () => {
      const vm = createListVM();
      const field = vm.field("title");
      expect(field?.name).toBe("title");
      expect(field?.label).toBe("タイトル");
    });

    it("field で存在しないフィールドは undefined", () => {
      const vm = createListVM();
      expect(vm.field("nonexistent")).toBeUndefined();
    });

    it("isSortable でソート可能か判定できる", () => {
      const vm = createListVM();
      expect(vm.isSortable("title")).toBe(true);
      expect(vm.isSortable("id")).toBe(false);
    });
  });

  describe("ソート操作", () => {
    it("defaultSort で現在のソートを取得できる", () => {
      const vm = createListVM();
      expect(vm.defaultSort?.field).toBe("title");
    });

    it("defaultSort でソートがない場合は undefined", () => {
      const vm = createListVM({ defaultSort: undefined });
      expect(vm.defaultSort).toBeUndefined();
    });

    it("sortOrder でソート順を取得できる", () => {
      const vm = createListVM();
      expect(vm.sortOrder("title")).toBe("asc");
      expect(vm.sortOrder("status")).toBeNull();
    });

    it("sortIcon でアイコンを取得できる", () => {
      const vm = createListVM();
      expect(vm.sortIcon("title")).toBe("↑");

      const vmDesc = createListVM({
        defaultSort: { field: "title", order: "desc" },
      });
      expect(vmDesc.sortIcon("title")).toBe("↓");

      expect(vm.sortIcon("status")).toBe("⇅");
    });
  });

  describe("検索操作", () => {
    it("isSearchable で検索可能か判定できる", () => {
      const vm = createListVM();
      expect(vm.isSearchable).toBe(true);

      const vmNoSearch = createListVM({ search: { fields: [], query: "" } });
      expect(vmNoSearch.isSearchable).toBe(false);
    });

    it("searchQuery で検索クエリを取得できる", () => {
      const vm = createListVM();
      expect(vm.searchQuery).toBe("記事");
    });

    it("searchFields で検索対象フィールドを取得できる", () => {
      const vm = createListVM();
      expect(vm.searchFields).toEqual(["title"]);
    });
  });

  describe("選択操作", () => {
    it("isSelectable で選択可能か判定できる", () => {
      const vm = createListVM();
      expect(vm.isSelectable).toBe(true);

      const vmNone = createListVM({
        selection: { mode: "none", selected: [] },
      });
      expect(vmNone.isSelectable).toBe(false);
    });

    it("isMultiSelect で複数選択か判定できる", () => {
      const vm = createListVM();
      expect(vm.isMultiSelect).toBe(true);

      const vmSingle = createListVM({
        selection: { mode: "single", selected: [] },
      });
      expect(vmSingle.isMultiSelect).toBe(false);
    });

    it("isSelected で行が選択中か判定できる", () => {
      const vm = createListVM();
      expect(vm.isSelected("1")).toBe(true);
      expect(vm.isSelected("2")).toBe(false);
    });

    it("isAllSelected で全選択か判定できる", () => {
      const vm = createListVM({
        selection: { mode: "multi", selected: ["1", "2"] },
      });
      expect(vm.isAllSelected).toBe(true);

      const vmPartial = createListVM();
      expect(vmPartial.isAllSelected).toBe(false);
    });

    it("selectedIds で選択中ID一覧を取得できる", () => {
      const vm = createListVM();
      expect(vm.selectedIds).toEqual(["1"]);
    });

    it("selectedCount で選択数を取得できる", () => {
      const vm = createListVM();
      expect(vm.selectedCount).toBe(1);
    });

    it("selectedRows で選択中の行データを取得できる", () => {
      const vm = createListVM();
      const rows = vm.selectedRows;
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe("1");
    });
  });

  describe("フィルター操作", () => {
    it("filters でフィルター一覧を取得できる", () => {
      const vm = createListVM();
      expect(vm.filters).toHaveLength(2);
    });

    it("activeFilters でアクティブなフィルターを取得できる", () => {
      const vm = createListVM();
      const active = vm.activeFilters;
      expect(active).toHaveLength(1);
      expect(active[0].id).toBe("all");
    });

    it("isFilterActive でフィルターがアクティブか判定できる", () => {
      const vm = createListVM();
      expect(vm.isFilterActive("all")).toBe(true);
      expect(vm.isFilterActive("draft")).toBe(false);
    });
  });

  describe("ページネーション操作", () => {
    it("page で現在ページを取得できる", () => {
      const vm = createListVM();
      expect(vm.page).toBe(1);
    });

    it("pageSize でページサイズを取得できる", () => {
      const vm = createListVM();
      expect(vm.pageSize).toBe(10);
    });

    it("total で総件数を取得できる", () => {
      const vm = createListVM();
      expect(vm.total).toBe(25);
    });

    it("totalPages で総ページ数を計算できる", () => {
      const vm = createListVM();
      expect(vm.totalPages).toBe(3);
    });

    it("hasNextPage で次ページがあるか判定できる", () => {
      const vm = createListVM();
      expect(vm.hasNextPage).toBe(true);

      const vmLastPage = createListVM({
        pagination: { page: 3, pageSize: 10, totalCount: 25 },
      });
      expect(vmLastPage.hasNextPage).toBe(false);
    });

    it("hasPrevPage で前ページがあるか判定できる", () => {
      const vm = createListVM();
      expect(vm.hasPrevPage).toBe(false);

      const vmPage2 = createListVM({
        pagination: { page: 2, pageSize: 10, totalCount: 25 },
      });
      expect(vmPage2.hasPrevPage).toBe(true);
    });
  });

  describe("アクション操作", () => {
    it("pageActions でページアクションを取得できる", () => {
      const vm = createListVM();
      expect(vm.pageActions).toHaveLength(1);
      expect(vm.pageActions[0].id).toBe("create");
    });

    it("bulkActions でバルクアクションを取得できる", () => {
      const vm = createListVM();
      expect(vm.bulkActions).toHaveLength(1);
      expect(vm.bulkActions[0].id).toBe("delete");
    });

    it("rowActions で行アクションを取得できる", () => {
      const vm = createListVM();
      const actions = vm.rowActions(vm.rows[0]);
      expect(actions).toHaveLength(1);
      expect(actions[0].id).toBe("edit");
    });

    it("allowedActions で許可されたアクションのみ取得できる", () => {
      const vm = createListVM();
      const actions = [
        { id: "edit", label: "編集", allowed: true },
        { id: "delete", label: "削除", allowed: false },
      ];
      const allowed = vm.allowedActions(actions);
      expect(allowed).toHaveLength(1);
      expect(allowed[0].id).toBe("edit");
    });
  });

  describe("行操作", () => {
    it("rows で全行を取得できる", () => {
      const vm = createListVM();
      expect(vm.rows).toHaveLength(2);
    });

    it("row で特定の行を取得できる", () => {
      const vm = createListVM();
      const row = vm.row("1");
      expect(row?.id).toBe("1");
    });

    it("rowCount で行数を取得できる", () => {
      const vm = createListVM();
      expect(vm.rowCount).toBe(2);
    });

    it("isEmpty で空か判定できる", () => {
      const vm = createListVM();
      expect(vm.isEmpty).toBe(false);

      const vmEmpty = createListVM({ rows: [] });
      expect(vmEmpty.isEmpty).toBe(true);
    });
  });

  describe("セル操作", () => {
    it("cellValue でセルの値を取得できる", () => {
      const vm = createListVM();
      expect(vm.cellValue(vm.rows[0], "title")).toBe("記事1");
    });

    it("formatCell でセルをフォーマットできる", () => {
      const vm = createListVM();
      const titleField = vm.field("title")!;
      expect(vm.formatCell(titleField, "テスト")).toBe("テスト");
    });

    it("formatCell で enum をラベルに変換できる", () => {
      const vm = createListVM();
      const statusField = vm.field("status")!;
      expect(vm.formatCell(statusField, "draft")).toBe("下書き");
      expect(vm.formatCell(statusField, "published")).toBe("公開");
    });

    it("formatCell で relation をラベルに変換できる", () => {
      const vm = createListVM();
      const authorField = vm.field("author")!;
      expect(vm.formatCell(authorField, { id: "u1", name: "田中" })).toBe(
        "田中",
      );
    });

    it("formatCell で null/undefined は - を返す", () => {
      const vm = createListVM();
      const titleField = vm.field("title")!;
      expect(vm.formatCell(titleField, null)).toBe("-");
      expect(vm.formatCell(titleField, undefined)).toBe("-");
    });
  });

  describe("状態操作", () => {
    it("isLoading で読み込み中か判定できる", () => {
      const vm = createListVM();
      expect(vm.isLoading).toBe(false);

      const vmLoading = createListVM({ isLoading: true });
      expect(vmLoading.isLoading).toBe(true);
    });

    it("error でエラーメッセージを取得できる", () => {
      const vm = createListVM();
      expect(vm.error).toBeUndefined();

      const vmError = createListVM({ error: "データ取得に失敗しました" });
      expect(vmError.error).toBe("データ取得に失敗しました");
    });
  });

  describe("メタ情報", () => {
    it("label でラベルを取得できる", () => {
      const vm = createListVM();
      expect(vm.label).toBe("投稿");
    });

    it("resource でリソース名を取得できる", () => {
      const vm = createListVM();
      expect(vm.resource).toBe("Post");
    });

    it("clickAction でクリックアクションを取得できる", () => {
      const vm = createListVM({ clickAction: "show" });
      expect(vm.clickAction).toBe("show");
    });
  });

  describe("状態更新（イミュータブル）", () => {
    describe("検索", () => {
      it("setSearchQuery で検索クエリを更新できる", () => {
        const vm = createListVM();
        const updated = vm.setSearchQuery("新しいクエリ");
        expect(updated.searchQuery).toBe("新しいクエリ");
        expect(vm.searchQuery).toBe("記事"); // 元は変わらない
        expect(updated).not.toBe(vm); // 別インスタンス
      });

      it("clearSearch で検索をクリアできる", () => {
        const vm = createListVM();
        const cleared = vm.clearSearch();
        expect(cleared.searchQuery).toBe("");
        expect(vm.searchQuery).toBe("記事");
      });
    });

    describe("フィルター", () => {
      it("toggleFilter でフィルターをトグルできる", () => {
        const vm = createListVM();
        expect(vm.isFilterActive("draft")).toBe(false);

        const updated = vm.toggleFilter("draft");
        expect(updated.isFilterActive("draft")).toBe(true);
        expect(vm.isFilterActive("draft")).toBe(false); // 元は変わらない

        const toggled = updated.toggleFilter("draft");
        expect(toggled.isFilterActive("draft")).toBe(false);
      });

      it("setFilterActive でフィルターを直接設定できる", () => {
        const vm = createListVM();
        const updated = vm.setFilterActive("draft", true);
        expect(updated.isFilterActive("draft")).toBe(true);
      });

      it("clearFilters で全フィルターをクリアできる", () => {
        const vm = createListVM({
          filters: {
            named: [
              { id: "all", label: "すべて", active: true },
              { id: "draft", label: "下書き", active: true },
            ],
          },
        });
        const updated = vm.clearFilters();
        expect(updated.activeFilters).toHaveLength(0);
      });
    });

    describe("選択", () => {
      it("toggleSelect で行を選択/解除できる", () => {
        const vm = createListVM({ selection: { mode: "multi", selected: [] } });

        const selected = vm.toggleSelect("1");
        expect(selected.isSelected("1")).toBe(true);

        const deselected = selected.toggleSelect("1");
        expect(deselected.isSelected("1")).toBe(false);
      });

      it("toggleSelectAll で全選択/全解除できる", () => {
        const vm = createListVM({ selection: { mode: "multi", selected: [] } });

        const allSelected = vm.toggleSelectAll();
        expect(allSelected.isAllSelected).toBe(true);
        expect(allSelected.selectedIds).toEqual(["1", "2"]);

        const allDeselected = allSelected.toggleSelectAll();
        expect(allDeselected.isAllSelected).toBe(false);
        expect(allDeselected.selectedIds).toEqual([]);
      });

      it("clearSelection で選択をクリアできる", () => {
        const vm = createListVM({
          selection: { mode: "multi", selected: ["1", "2"] },
        });
        const updated = vm.clearSelection();
        expect(updated.selectedIds).toEqual([]);
      });
    });

    describe("ソート", () => {
      it("setSort でソートを設定できる", () => {
        const vm = createListVM();
        const updated = vm.setSort("status", "desc");
        expect(updated.defaultSort?.field).toBe("status");
        expect(updated.sortOrder("status")).toBe("desc");
      });

      it("toggleSort でソートをトグルできる", () => {
        const vm = createListVM({ defaultSort: undefined });

        // なし → asc
        const asc = vm.toggleSort("title");
        expect(asc.sortOrder("title")).toBe("asc");

        // asc → desc
        const desc = asc.toggleSort("title");
        expect(desc.sortOrder("title")).toBe("desc");

        // desc → なし
        const none = desc.toggleSort("title");
        expect(none.defaultSort).toBeUndefined();

        // 別フィールドへ切り替え → asc
        const another = asc.toggleSort("status");
        expect(another.defaultSort?.field).toBe("status");
        expect(another.sortOrder("status")).toBe("asc");
      });
    });

    describe("ページネーション", () => {
      it("setPage でページを設定できる", () => {
        const vm = createListVM();
        const updated = vm.setPage(2);
        expect(updated.page).toBe(2);
        expect(vm.page).toBe(1); // 元は変わらない
      });

      it("setPage は pagination がない場合は同じインスタンスを返す", () => {
        const vm = createListVM({ pagination: undefined });
        const updated = vm.setPage(2);
        expect(updated).toBe(vm);
      });

      it("nextPage で次のページへ移動できる", () => {
        const vm = createListVM();
        const updated = vm.nextPage();
        expect(updated.page).toBe(2);
      });

      it("prevPage で前のページへ移動できる", () => {
        const vm = createListVM({
          pagination: { page: 2, pageSize: 10, totalCount: 25 },
        });
        const updated = vm.prevPage();
        expect(updated.page).toBe(1);
      });

      it("firstPage で最初のページへ移動できる", () => {
        const vm = createListVM({
          pagination: { page: 3, pageSize: 10, totalCount: 25 },
        });
        const updated = vm.firstPage();
        expect(updated.page).toBe(1);
      });

      it("lastPage で最後のページへ移動できる", () => {
        const vm = createListVM();
        const updated = vm.lastPage();
        expect(updated.page).toBe(3);
      });
    });

    describe("状態", () => {
      it("setLoading でローディング状態を設定できる", () => {
        const vm = createListVM();
        const loading = vm.setLoading(true);
        expect(loading.isLoading).toBe(true);

        const notLoading = loading.setLoading(false);
        expect(notLoading.isLoading).toBe(false);
      });

      it("setError でエラーを設定できる", () => {
        const vm = createListVM();
        const withError = vm.setError("エラーが発生しました");
        expect(withError.error).toBe("エラーが発生しました");

        const cleared = withError.setError(undefined);
        expect(cleared.error).toBeUndefined();
      });

      it("setRows で行データを更新できる", () => {
        const vm = createListVM();
        const newRows = [{ id: "3", values: { title: "新記事" }, actions: [] }];
        const updated = vm.setRows(newRows, 50);
        expect(updated.rows).toHaveLength(1);
        expect(updated.total).toBe(50);
        expect(vm.rows).toHaveLength(2); // 元は変わらない
      });

      it("setRows で totalCount を省略すると既存値を維持", () => {
        const vm = createListVM();
        const newRows = [{ id: "3", values: {}, actions: [] }];
        const updated = vm.setRows(newRows);
        expect(updated.total).toBe(25);
      });
    });

    describe("メソッドチェーン", () => {
      it("複数の操作をチェーンできる", () => {
        const vm = createListVM({ selection: { mode: "multi", selected: [] } });

        const updated = vm
          .setSearchQuery("テスト")
          .toggleFilter("draft")
          .toggleSelect("1")
          .setPage(2);

        expect(updated.searchQuery).toBe("テスト");
        expect(updated.isFilterActive("draft")).toBe(true);
        expect(updated.isSelected("1")).toBe(true);
        expect(updated.page).toBe(2);

        // 元は変わらない
        expect(vm.searchQuery).toBe("記事");
        expect(vm.isFilterActive("draft")).toBe(false);
        expect(vm.isSelected("1")).toBe(false);
        expect(vm.page).toBe(1);
      });
    });
  });

  describe("行の状態", () => {
    it("rowsLoadingIds でローディング中の行IDを取得できる", () => {
      const vm = createListVM({ rowsLoading: ["1", "2"] });
      expect(vm.rowsLoadingIds).toEqual(["1", "2"]);
    });

    it("isRowLoading で行がローディング中か判定できる", () => {
      const vm = createListVM({ rowsLoading: ["1"] });
      expect(vm.isRowLoading("1")).toBe(true);
      expect(vm.isRowLoading("2")).toBe(false);
    });

    it("setRowLoading で行のローディング状態を設定できる", () => {
      const vm = createListVM();
      const loading = vm.setRowLoading("1", true);
      expect(loading.isRowLoading("1")).toBe(true);

      const notLoading = loading.setRowLoading("1", false);
      expect(notLoading.isRowLoading("1")).toBe(false);
    });

    it("setRowsLoading で複数行のローディング状態を設定できる", () => {
      const vm = createListVM();
      const loading = vm.setRowsLoading(["1", "2"], true);
      expect(loading.isRowLoading("1")).toBe(true);
      expect(loading.isRowLoading("2")).toBe(true);

      const notLoading = loading.setRowsLoading(["1"], false);
      expect(notLoading.isRowLoading("1")).toBe(false);
      expect(notLoading.isRowLoading("2")).toBe(true);
    });

    it("rowErrors で行のエラーを取得できる", () => {
      const vm = createListVM({ rowErrors: { "1": ["エラー1", "エラー2"] } });
      expect(vm.rowErrors("1")).toEqual(["エラー1", "エラー2"]);
      expect(vm.rowErrors("2")).toEqual([]);
    });

    it("hasRowErrors で行にエラーがあるか判定できる", () => {
      const vm = createListVM({ rowErrors: { "1": ["エラー"] } });
      expect(vm.hasRowErrors("1")).toBe(true);
      expect(vm.hasRowErrors("2")).toBe(false);
    });

    it("setRowErrors で行のエラーを設定できる", () => {
      const vm = createListVM();
      const withErrors = vm.setRowErrors("1", ["エラー1"]);
      expect(withErrors.rowErrors("1")).toEqual(["エラー1"]);

      const cleared = withErrors.setRowErrors("1", []);
      expect(cleared.rowErrors("1")).toEqual([]);
    });

    it("clearRowErrors で行のエラーをクリアできる", () => {
      const vm = createListVM({ rowErrors: { "1": ["エラー"] } });
      const cleared = vm.clearRowErrors("1");
      expect(cleared.rowErrors("1")).toEqual([]);
    });

    it("clearAllRowErrors で全行のエラーをクリアできる", () => {
      const vm = createListVM({
        rowErrors: { "1": ["エラー1"], "2": ["エラー2"] },
      });
      const cleared = vm.clearAllRowErrors();
      expect(cleared.rowErrors("1")).toEqual([]);
      expect(cleared.rowErrors("2")).toEqual([]);
    });
  });

  describe("バルクアクション", () => {
    it("startBulkAction でバルクアクションを開始できる", () => {
      const vm = createListVM();
      const started = vm.startBulkAction("delete", ["1", "2"]);
      expect(started.isBulkActionInProgress).toBe(true);
      expect(started.bulkActionId).toBe("delete");
      expect(started.bulkProgress?.total).toBe(2);
      expect(started.bulkProgress?.completed).toBe(0);
    });

    it("updateBulkRowStatus で行ステータスを更新できる", () => {
      const vm = createListVM().startBulkAction("delete", ["1", "2"]);
      const updated = vm.updateBulkRowStatus("1", "success");
      expect(updated.bulkProgress?.completed).toBe(1);
      expect(updated.bulkProgress?.rowStatus?.["1"]).toBe("success");
    });

    it("bulkProgressPercent で進捗率を取得できる", () => {
      const vm = createListVM()
        .startBulkAction("delete", ["1", "2"])
        .updateBulkRowStatus("1", "success");
      expect(vm.bulkProgressPercent).toBe(50);
    });

    it("completeBulkAction でバルクアクションを完了できる", () => {
      const vm = createListVM().startBulkAction("delete", ["1"]);
      const completed = vm.completeBulkAction();
      expect(completed.isBulkActionInProgress).toBe(false);
      expect(completed.bulkActionId).toBeUndefined();
    });

    it("cancelBulkAction でバルクアクションをキャンセルできる", () => {
      const vm = createListVM().startBulkAction("delete", ["1"]);
      const cancelled = vm.cancelBulkAction();
      expect(cancelled.isBulkActionInProgress).toBe(false);
      expect(cancelled.bulkProgress).toBeUndefined();
    });
  });

  describe("APIクエリ生成", () => {
    it("toQueryParams でAPIクエリパラメータを生成できる", () => {
      const vm = createListVM();
      const params = vm.toQueryParams();
      expect(params.page).toBe(1);
      expect(params.per_page).toBe(10);
      expect(params.sort).toBe("title");
      expect(params.order).toBe("asc");
      expect(params.search).toBe("記事");
      expect(params.filter).toBe("all");
    });
  });
});
