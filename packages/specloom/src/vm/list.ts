// ============================================================
// ListVM - List ViewModel 操作関数
// ============================================================

import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "./types.js";
import { Format, type FormatOptions } from "../format/index.js";

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
  sortField: (vm: ListViewModel) => vm.defaultSort?.field ?? null,
  sortOrder: (vm: ListViewModel, name: string): "asc" | "desc" | null =>
    vm.defaultSort?.field === name ? vm.defaultSort.order : null,
  sortIcon: (vm: ListViewModel, name: string): string => {
    const order = ListVM.sortOrder(vm, name);
    return order === "asc" ? "↑" : order === "desc" ? "↓" : "⇅";
  },

  // ============================================================
  // 検索
  // ============================================================
  searchable: (vm: ListViewModel) => vm.search.fields.length > 0,
  searchQuery: (vm: ListViewModel) => vm.search.query,
  searchFields: (vm: ListViewModel) => vm.search.fields,

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

  // ============================================================
  // フィルター
  // ============================================================
  filters: (vm: ListViewModel) => vm.filters.named,
  activeFilters: (vm: ListViewModel) =>
    vm.filters.named.filter((f) => f.active),
  filterActive: (vm: ListViewModel, id: string) =>
    vm.filters.named.find((f) => f.id === id)?.active ?? false,
  customFilter: (vm: ListViewModel) => vm.filters.custom,

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

  /** ソートを設定 */
  setSort: (
    vm: ListViewModel,
    field: string,
    order: "asc" | "desc",
  ): ListViewModel => ({
    ...vm,
    defaultSort: { field, order },
  }),

  /** ソートをトグル（asc → desc → なし → asc） */
  toggleSort: (vm: ListViewModel, field: string): ListViewModel => {
    const current = vm.defaultSort;
    if (current?.field !== field) {
      return { ...vm, defaultSort: { field, order: "asc" } };
    }
    if (current.order === "asc") {
      return { ...vm, defaultSort: { field, order: "desc" } };
    }
    return { ...vm, defaultSort: undefined };
  },

  /** ページを設定 */
  setPage: (vm: ListViewModel, page: number): ListViewModel => {
    if (!vm.pagination) return vm;
    return {
      ...vm,
      pagination: { ...vm.pagination, page },
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
};
