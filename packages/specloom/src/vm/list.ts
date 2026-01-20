// ============================================================
// ListVM - List ViewModel 操作関数
// ============================================================

import type {
  ListViewModel,
  ListFieldVM,
  RowVM,
  ActionVM,
  FilterExpression,
  SortVM,
  BulkActionProgress,
} from "./types.js";
import { Format, type FormatOptions } from "../format/index.js";
import { evaluateFilter } from "../filter/index.js";

export const ListVM = {
  // ============================================================
  // フィールド
  // ============================================================
  fields: (vm: ListViewModel) => vm.fields,
  field: (vm: ListViewModel, name: string) =>
    vm.fields.find((f) => f.name === name),
  sortable: (vm: ListViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.sortable ?? false,

  // ============================================================
  // ソート
  // ============================================================
  /** デフォルトソートフィールド */
  sortField: (vm: ListViewModel) => vm.defaultSort?.field ?? null,
  /** 指定フィールドのソート順（defaultSort用、後方互換） */
  sortOrder: (vm: ListViewModel, name: string): "asc" | "desc" | null =>
    vm.defaultSort?.field === name ? vm.defaultSort.order : null,
  sortIcon: (vm: ListViewModel, name: string): string => {
    const order = ListVM.sortOrder(vm, name);
    return order === "asc" ? "↑" : order === "desc" ? "↓" : "⇅";
  },

  /** 現在のソート一覧（複数カラム対応） */
  sorts: (vm: ListViewModel): SortVM[] =>
    vm.sorts ?? (vm.defaultSort ? [vm.defaultSort] : []),

  /** 指定フィールドのソート情報を取得 */
  getSort: (vm: ListViewModel, field: string): SortVM | undefined =>
    ListVM.sorts(vm).find((s) => s.field === field),

  /** 指定フィールドがソートされているか */
  isSorted: (vm: ListViewModel, field: string): boolean =>
    ListVM.sorts(vm).some((s) => s.field === field),

  /** 指定フィールドのソート優先度（0が最優先、-1はソートなし） */
  sortPriority: (vm: ListViewModel, field: string): number => {
    const index = ListVM.sorts(vm).findIndex((s) => s.field === field);
    return index;
  },

  /** ソートがアクティブか */
  hasSorts: (vm: ListViewModel): boolean => ListVM.sorts(vm).length > 0,

  // ============================================================
  // 検索
  // ============================================================
  searchable: (vm: ListViewModel) => vm.search.fields.length > 0,
  searchQuery: (vm: ListViewModel) => vm.search.query,
  searchFields: (vm: ListViewModel) => vm.search.fields,
  /** 検索がアクティブか（クエリが空でない） */
  isSearchActive: (vm: ListViewModel): boolean => vm.search.query.length > 0,

  // ============================================================
  // 選択
  // ============================================================
  selectable: (vm: ListViewModel) => vm.selection.mode !== "none",
  multiSelect: (vm: ListViewModel) => vm.selection.mode === "multi",
  singleSelect: (vm: ListViewModel) => vm.selection.mode === "single",
  selected: (vm: ListViewModel, rowId: string) =>
    vm.selection.selected.includes(rowId),
  allSelected: (vm: ListViewModel) =>
    vm.rows.length > 0 && vm.selection.selected.length === vm.rows.length,
  selectedIds: (vm: ListViewModel) => vm.selection.selected,
  selectedCount: (vm: ListViewModel) => vm.selection.selected.length,
  selectedRows: (vm: ListViewModel) =>
    vm.rows.filter((r) => vm.selection.selected.includes(r.id)),
  /** 一部のみ選択されている（indeterminate状態） */
  isIndeterminate: (vm: ListViewModel): boolean =>
    vm.selection.selected.length > 0 &&
    vm.selection.selected.length < vm.rows.length,
  /** 選択状態: "none" | "some" | "all" */
  selectionState: (vm: ListViewModel): "none" | "some" | "all" => {
    if (vm.selection.selected.length === 0) return "none";
    if (vm.selection.selected.length === vm.rows.length) return "all";
    return "some";
  },

  // ============================================================
  // フィルター
  // ============================================================
  filters: (vm: ListViewModel) => vm.filters.named,
  activeFilters: (vm: ListViewModel) =>
    vm.filters.named.filter((f) => f.active),
  filterActive: (vm: ListViewModel, id: string) =>
    vm.filters.named.find((f) => f.id === id)?.active ?? false,
  customFilter: (vm: ListViewModel) => vm.filters.custom,

  /** 指定したフィルターの条件式を取得 */
  getFilterExpression: (
    vm: ListViewModel,
    filterId: string,
  ): FilterExpression | undefined =>
    vm.filters.named.find((f) => f.id === filterId)?.filter,

  /**
   * アクティブなフィルター条件を結合して取得
   * 複数のフィルターがアクティブな場合はANDで結合
   */
  getActiveFilterExpression: (
    vm: ListViewModel,
  ): FilterExpression | undefined => {
    const activeFilters = vm.filters.named.filter((f) => f.active && f.filter);
    const customFilter = vm.filters.custom;

    const expressions: FilterExpression[] = [];
    for (const f of activeFilters) {
      if (f.filter) expressions.push(f.filter);
    }
    if (customFilter) expressions.push(customFilter);

    if (expressions.length === 0) return undefined;
    if (expressions.length === 1) return expressions[0];
    return { and: expressions };
  },

  /**
   * 行がアクティブなフィルター条件にマッチするか判定
   */
  rowMatchesFilter: (vm: ListViewModel, row: RowVM): boolean => {
    const filter = ListVM.getActiveFilterExpression(vm);
    if (!filter) return true;
    return evaluateFilter(filter, row.values as Record<string, unknown>);
  },

  /**
   * アクティブなフィルター条件で行をフィルタリング（クライアントサイド）
   */
  filterRows: (vm: ListViewModel): RowVM[] => {
    const filter = ListVM.getActiveFilterExpression(vm);
    if (!filter) return vm.rows;
    return vm.rows.filter((row) =>
      evaluateFilter(filter, row.values as Record<string, unknown>),
    );
  },

  // ============================================================
  // ページネーション
  // ============================================================
  page: (vm: ListViewModel) => vm.pagination?.page ?? 1,
  pageSize: (vm: ListViewModel) => vm.pagination?.pageSize ?? vm.rows.length,
  total: (vm: ListViewModel) => vm.pagination?.totalCount ?? vm.rows.length,
  totalPages: (vm: ListViewModel) => {
    const size = vm.pagination?.pageSize;
    const total = vm.pagination?.totalCount;
    if (!size || !total) return 1;
    return Math.ceil(total / size);
  },
  hasNext: (vm: ListViewModel) => ListVM.page(vm) < ListVM.totalPages(vm),
  hasNextPage: (vm: ListViewModel) => ListVM.page(vm) < ListVM.totalPages(vm),
  hasPrev: (vm: ListViewModel) => ListVM.page(vm) > 1,
  hasPrevPage: (vm: ListViewModel) => ListVM.page(vm) > 1,
  /** 最初のページか */
  isFirstPage: (vm: ListViewModel): boolean => ListVM.page(vm) === 1,
  /** 最後のページか */
  isLastPage: (vm: ListViewModel): boolean =>
    ListVM.page(vm) >= ListVM.totalPages(vm),
  /** 現在表示中のレコード範囲（1始まり） */
  pageRange: (vm: ListViewModel): { start: number; end: number } => {
    const page = ListVM.page(vm);
    const size = ListVM.pageSize(vm);
    const total = ListVM.total(vm);
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return { start, end };
  },
  /** ページ情報文字列 "1-20 of 150" */
  pageInfo: (vm: ListViewModel): string => {
    const { start, end } = ListVM.pageRange(vm);
    const total = ListVM.total(vm);
    return `${start}-${end} of ${total}`;
  },

  // ============================================================
  // アクション
  // ============================================================
  headerActions: (vm: ListViewModel) => vm.headerActions,
  bulkActions: (vm: ListViewModel) => vm.bulkActions,
  rowActions: (row: RowVM) => row.actions,
  allowedActions: (actions: ActionVM[]) => actions.filter((a) => a.allowed),

  // ============================================================
  // 行
  // ============================================================
  rows: (vm: ListViewModel) => vm.rows,
  row: (vm: ListViewModel, id: string) => vm.rows.find((r) => r.id === id),
  rowCount: (vm: ListViewModel) => vm.rows.length,
  empty: (vm: ListViewModel) => vm.rows.length === 0,

  // ============================================================
  // セル
  // ============================================================
  cellValue: (row: RowVM, name: string) => row.values[name],
  formatCell: (
    field: ListFieldVM,
    value: unknown,
    options?: FormatOptions,
  ): string => Format.field(value, field, options),

  // ============================================================
  // 状態
  // ============================================================
  loading: (vm: ListViewModel) => vm.isLoading ?? false,
  error: (vm: ListViewModel) => vm.error,

  // ============================================================
  // 行の状態
  // ============================================================
  /** 行がローディング中か */
  rowLoading: (vm: ListViewModel, rowId: string): boolean =>
    vm.rowsLoading?.includes(rowId) ?? false,
  /** ローディング中の行ID一覧 */
  rowsLoadingIds: (vm: ListViewModel): string[] => vm.rowsLoading ?? [],
  /** 行にエラーがあるか */
  rowHasErrors: (vm: ListViewModel, rowId: string): boolean =>
    (vm.rowErrors?.[rowId]?.length ?? 0) > 0,
  /** 行のエラー一覧 */
  rowErrors: (vm: ListViewModel, rowId: string): string[] =>
    vm.rowErrors?.[rowId] ?? [],

  // ============================================================
  // バルクアクション状態
  // ============================================================
  /** バルクアクションが実行中か */
  isBulkActionInProgress: (vm: ListViewModel): boolean =>
    vm.bulkActionInProgress != null,
  /** 実行中のバルクアクションID */
  bulkActionId: (vm: ListViewModel): string | undefined =>
    vm.bulkActionInProgress,
  /** バルクアクションの進捗 */
  bulkProgress: (vm: ListViewModel): BulkActionProgress | undefined =>
    vm.bulkActionProgress,
  /** バルクアクションの進捗率（0-100） */
  bulkProgressPercent: (vm: ListViewModel): number => {
    const progress = vm.bulkActionProgress;
    if (!progress || progress.total === 0) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  },

  // ============================================================
  // メタ
  // ============================================================
  label: (vm: ListViewModel) => vm.label,
  resource: (vm: ListViewModel) => vm.resource,
  clickAction: (vm: ListViewModel) => vm.clickAction,

  // ============================================================
  // 状態更新（イミュータブル）
  // ============================================================

  /** 検索クエリを更新 */
  setSearchQuery: (vm: ListViewModel, query: string): ListViewModel => ({
    ...vm,
    search: { ...vm.search, query },
  }),

  /** 検索をクリア */
  clearSearch: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    search: { ...vm.search, query: "" },
  }),

  /** フィルターをトグル */
  toggleFilter: (vm: ListViewModel, filterId: string): ListViewModel => ({
    ...vm,
    filters: {
      ...vm.filters,
      named: vm.filters.named.map((f) =>
        f.id === filterId ? { ...f, active: !f.active } : f,
      ),
    },
  }),

  /** フィルターを設定 */
  setFilterActive: (
    vm: ListViewModel,
    filterId: string,
    active: boolean,
  ): ListViewModel => ({
    ...vm,
    filters: {
      ...vm.filters,
      named: vm.filters.named.map((f) =>
        f.id === filterId ? { ...f, active } : f,
      ),
    },
  }),

  /** 全フィルターをクリア */
  clearFilters: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    filters: {
      ...vm.filters,
      named: vm.filters.named.map((f) => ({ ...f, active: false })),
      custom: undefined,
    },
  }),

  /** カスタムフィルターを設定 */
  setCustomFilter: (
    vm: ListViewModel,
    filter: FilterExpression | undefined,
  ): ListViewModel => ({
    ...vm,
    filters: {
      ...vm.filters,
      custom: filter,
    },
  }),

  /** カスタムフィルターをクリア */
  clearCustomFilter: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    filters: {
      ...vm.filters,
      custom: undefined,
    },
  }),

  /** 行を選択/解除 */
  toggleSelect: (vm: ListViewModel, rowId: string): ListViewModel => {
    const selected = vm.selection.selected.includes(rowId)
      ? vm.selection.selected.filter((id) => id !== rowId)
      : [...vm.selection.selected, rowId];
    return {
      ...vm,
      selection: { ...vm.selection, selected },
    };
  },

  /** 全選択/全解除 */
  toggleSelectAll: (vm: ListViewModel): ListViewModel => {
    const allSelected =
      vm.rows.length > 0 && vm.selection.selected.length === vm.rows.length;
    return {
      ...vm,
      selection: {
        ...vm.selection,
        selected: allSelected ? [] : vm.rows.map((r) => r.id),
      },
    };
  },

  /** 選択をクリア */
  clearSelection: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    selection: { ...vm.selection, selected: [] },
  }),

  /** ソートを設定（単一、後方互換） */
  setSort: (
    vm: ListViewModel,
    field: string,
    order: "asc" | "desc",
  ): ListViewModel => ({
    ...vm,
    sorts: [{ field, order }],
    defaultSort: { field, order },
  }),

  /** ソートをトグル（asc → desc → なし → asc） */
  toggleSort: (vm: ListViewModel, field: string): ListViewModel => {
    const sorts = ListVM.sorts(vm);
    const existing = sorts.find((s) => s.field === field);

    if (!existing) {
      // 新しいソートを追加（プライマリに）
      return {
        ...vm,
        sorts: [{ field, order: "asc" }, ...sorts],
        defaultSort: { field, order: "asc" },
      };
    }

    if (existing.order === "asc") {
      // asc → desc
      const newSorts = sorts.map((s) =>
        s.field === field ? { ...s, order: "desc" as const } : s,
      );
      return {
        ...vm,
        sorts: newSorts,
        defaultSort: newSorts[0],
      };
    }

    // desc → 削除
    const newSorts = sorts.filter((s) => s.field !== field);
    return {
      ...vm,
      sorts: newSorts.length > 0 ? newSorts : undefined,
      defaultSort: newSorts[0],
    };
  },

  /** ソートを追加（複数カラムソート） */
  addSort: (
    vm: ListViewModel,
    field: string,
    order: "asc" | "desc",
  ): ListViewModel => {
    const sorts = ListVM.sorts(vm).filter((s) => s.field !== field);
    const newSorts = [...sorts, { field, order }];
    return {
      ...vm,
      sorts: newSorts,
      defaultSort: newSorts[0],
    };
  },

  /** ソートを削除 */
  removeSort: (vm: ListViewModel, field: string): ListViewModel => {
    const newSorts = ListVM.sorts(vm).filter((s) => s.field !== field);
    return {
      ...vm,
      sorts: newSorts.length > 0 ? newSorts : undefined,
      defaultSort: newSorts[0],
    };
  },

  /** 全ソートをクリア */
  clearSorts: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    sorts: undefined,
    defaultSort: undefined,
  }),

  /** ソートをリセット（デフォルトに戻す） */
  resetSort: (vm: ListViewModel, defaultSort?: SortVM): ListViewModel => ({
    ...vm,
    sorts: defaultSort ? [defaultSort] : undefined,
    defaultSort,
  }),

  /** ページを設定 */
  setPage: (vm: ListViewModel, page: number): ListViewModel => {
    if (!vm.pagination) return vm;
    return {
      ...vm,
      pagination: { ...vm.pagination, page },
    };
  },

  /** ページサイズを設定 */
  setPageSize: (vm: ListViewModel, pageSize: number): ListViewModel => {
    if (!vm.pagination) return vm;
    return {
      ...vm,
      pagination: { ...vm.pagination, pageSize, page: 1 },
    };
  },

  /** 次のページへ */
  nextPage: (vm: ListViewModel): ListViewModel => {
    if (!vm.pagination || !ListVM.hasNextPage(vm)) return vm;
    return {
      ...vm,
      pagination: { ...vm.pagination, page: vm.pagination.page + 1 },
    };
  },

  /** 前のページへ */
  prevPage: (vm: ListViewModel): ListViewModel => {
    if (!vm.pagination || !ListVM.hasPrevPage(vm)) return vm;
    return {
      ...vm,
      pagination: { ...vm.pagination, page: vm.pagination.page - 1 },
    };
  },

  /** 最初のページへ */
  firstPage: (vm: ListViewModel): ListViewModel => {
    if (!vm.pagination) return vm;
    return {
      ...vm,
      pagination: { ...vm.pagination, page: 1 },
    };
  },

  /** 最後のページへ */
  lastPage: (vm: ListViewModel): ListViewModel => {
    if (!vm.pagination) return vm;
    return {
      ...vm,
      pagination: { ...vm.pagination, page: ListVM.totalPages(vm) },
    };
  },

  /** ローディング状態を設定 */
  setLoading: (vm: ListViewModel, isLoading: boolean): ListViewModel => ({
    ...vm,
    isLoading,
  }),

  /** エラーを設定 */
  setError: (vm: ListViewModel, error: string | undefined): ListViewModel => ({
    ...vm,
    error,
  }),

  /** 行データを更新 */
  setRows: (
    vm: ListViewModel,
    rows: RowVM[],
    totalCount?: number,
  ): ListViewModel => ({
    ...vm,
    rows,
    pagination: vm.pagination
      ? { ...vm.pagination, totalCount: totalCount ?? vm.pagination.totalCount }
      : undefined,
  }),

  // ============================================================
  // 行のローディング・エラー状態更新
  // ============================================================

  /** 行のローディング状態を設定 */
  setRowLoading: (
    vm: ListViewModel,
    rowId: string,
    isLoading: boolean,
  ): ListViewModel => {
    const current = vm.rowsLoading ?? [];
    const rowsLoading = isLoading
      ? current.includes(rowId)
        ? current
        : [...current, rowId]
      : current.filter((id) => id !== rowId);
    return {
      ...vm,
      rowsLoading: rowsLoading.length > 0 ? rowsLoading : undefined,
    };
  },

  /** 複数行のローディング状態を設定 */
  setRowsLoading: (
    vm: ListViewModel,
    rowIds: string[],
    isLoading: boolean,
  ): ListViewModel => {
    if (isLoading) {
      const current = vm.rowsLoading ?? [];
      const newIds = rowIds.filter((id) => !current.includes(id));
      return {
        ...vm,
        rowsLoading: [...current, ...newIds],
      };
    }
    const rowsLoading = (vm.rowsLoading ?? []).filter(
      (id) => !rowIds.includes(id),
    );
    return {
      ...vm,
      rowsLoading: rowsLoading.length > 0 ? rowsLoading : undefined,
    };
  },

  /** 行のエラーを設定 */
  setRowErrors: (
    vm: ListViewModel,
    rowId: string,
    errors: string[],
  ): ListViewModel => {
    const current = vm.rowErrors ?? {};
    if (errors.length === 0) {
      const { [rowId]: _, ...rest } = current;
      return {
        ...vm,
        rowErrors: Object.keys(rest).length > 0 ? rest : undefined,
      };
    }
    return {
      ...vm,
      rowErrors: { ...current, [rowId]: errors },
    };
  },

  /** 行のエラーをクリア */
  clearRowErrors: (vm: ListViewModel, rowId: string): ListViewModel =>
    ListVM.setRowErrors(vm, rowId, []),

  /** 全行のエラーをクリア */
  clearAllRowErrors: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    rowErrors: undefined,
  }),

  // ============================================================
  // バルクアクション状態更新
  // ============================================================

  /** バルクアクションを開始 */
  startBulkAction: (
    vm: ListViewModel,
    actionId: string,
    rowIds: string[],
  ): ListViewModel => ({
    ...vm,
    bulkActionInProgress: actionId,
    bulkActionProgress: {
      total: rowIds.length,
      completed: 0,
      failed: 0,
      rowStatus: Object.fromEntries(rowIds.map((id) => [id, "pending"])),
    },
  }),

  /** バルクアクションの行ステータスを更新 */
  updateBulkRowStatus: (
    vm: ListViewModel,
    rowId: string,
    status: "success" | "failed" | "skipped",
    error?: string,
  ): ListViewModel => {
    if (!vm.bulkActionProgress) return vm;
    const rowStatus = { ...vm.bulkActionProgress.rowStatus, [rowId]: status };
    const rowErrors = error
      ? { ...vm.bulkActionProgress.rowErrors, [rowId]: error }
      : vm.bulkActionProgress.rowErrors;
    const completed =
      status === "success" || status === "skipped"
        ? vm.bulkActionProgress.completed + 1
        : vm.bulkActionProgress.completed;
    const failed =
      status === "failed"
        ? vm.bulkActionProgress.failed + 1
        : vm.bulkActionProgress.failed;
    return {
      ...vm,
      bulkActionProgress: {
        ...vm.bulkActionProgress,
        completed,
        failed,
        rowStatus,
        rowErrors,
      },
    };
  },

  /** バルクアクションを完了 */
  completeBulkAction: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    bulkActionInProgress: undefined,
  }),

  /** バルクアクションをキャンセル */
  cancelBulkAction: (vm: ListViewModel): ListViewModel => ({
    ...vm,
    bulkActionInProgress: undefined,
    bulkActionProgress: undefined,
  }),

  // ============================================================
  // APIクエリ生成
  // ============================================================

  /** APIクエリパラメータを生成 */
  toQueryParams: (
    vm: ListViewModel,
  ): Record<string, string | number | undefined> => {
    const params: Record<string, string | number | undefined> = {};

    // ページネーション
    if (vm.pagination) {
      params.page = vm.pagination.page;
      params.per_page = vm.pagination.pageSize;
    }

    // ソート
    const sorts = ListVM.sorts(vm);
    if (sorts.length > 0) {
      params.sort = sorts.map((s) => s.field).join(",");
      params.order = sorts.map((s) => s.order).join(",");
    }

    // 検索
    if (vm.search.query) {
      params.search = vm.search.query;
    }

    // フィルター（アクティブなnamed filter）
    const activeFilters = vm.filters.named.filter((f) => f.active);
    if (activeFilters.length > 0) {
      params.filter = activeFilters.map((f) => f.id).join(",");
    }

    return params;
  },
};
