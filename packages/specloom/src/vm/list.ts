// ============================================================
// ListVM - List ViewModel Class (Immutable OOP Style)
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

/**
 * ListVM - Immutable ViewModel class for list views
 *
 * All setter methods return a new instance, preserving immutability.
 * Method chaining is supported for fluent API usage.
 *
 * @example
 * ```typescript
 * const list = new ListVM(data)
 *
 * // Getters
 * list.fields
 * list.rows
 * list.searchQuery
 *
 * // Method chaining
 * const updated = list
 *   .setSearchQuery("test")
 *   .toggleFilter("active")
 *   .setPage(1)
 * ```
 */
export class ListVM {
  constructor(public readonly data: ListViewModel) {}

  // ============================================================
  // Static Factory
  // ============================================================

  /**
   * Create a new ListVM from plain data
   */
  static from(data: ListViewModel): ListVM {
    return new ListVM(data);
  }

  // ============================================================
  // フィールド
  // ============================================================

  /** フィールド一覧 */
  get fields(): ListFieldVM[] {
    return this.data.fields;
  }

  /** 特定のフィールドを取得 */
  field(name: string): ListFieldVM | undefined {
    return this.data.fields.find((f) => f.name === name);
  }

  /** フィールドがソート可能か */
  isSortable(name: string): boolean {
    return this.field(name)?.sortable ?? false;
  }

  // ============================================================
  // ソート
  // ============================================================

  /** デフォルトソート */
  get defaultSort(): SortVM | undefined {
    return this.data.defaultSort;
  }

  /** 現在のソート一覧（複数カラム対応） */
  get sorts(): SortVM[] {
    return (
      this.data.sorts ?? (this.data.defaultSort ? [this.data.defaultSort] : [])
    );
  }

  /** ソートがアクティブか */
  get hasSorts(): boolean {
    return this.sorts.length > 0;
  }

  /** 指定フィールドのソート情報を取得 */
  getSort(field: string): SortVM | undefined {
    return this.sorts.find((s) => s.field === field);
  }

  /** 指定フィールドがソートされているか */
  isSorted(field: string): boolean {
    return this.sorts.some((s) => s.field === field);
  }

  /** 指定フィールドのソート順 */
  sortOrder(field: string): "asc" | "desc" | null {
    return this.getSort(field)?.order ?? null;
  }

  /** ソートアイコン */
  sortIcon(field: string): string {
    const order = this.sortOrder(field);
    return order === "asc" ? "↑" : order === "desc" ? "↓" : "⇅";
  }

  /** 指定フィールドのソート優先度（0が最優先、-1はソートなし） */
  sortPriority(field: string): number {
    return this.sorts.findIndex((s) => s.field === field);
  }

  // ============================================================
  // 検索
  // ============================================================

  /** 検索可能か */
  get isSearchable(): boolean {
    return this.data.search.fields.length > 0;
  }

  /** 検索クエリ */
  get searchQuery(): string {
    return this.data.search.query;
  }

  /** 検索対象フィールド */
  get searchFields(): string[] {
    return this.data.search.fields;
  }

  /** 検索がアクティブか（クエリが空でない） */
  get isSearchActive(): boolean {
    return this.data.search.query.length > 0;
  }

  // ============================================================
  // 選択
  // ============================================================

  /** 選択モード */
  get selectionMode(): "none" | "single" | "multi" {
    return this.data.selection.mode;
  }

  /** 選択可能か */
  get isSelectable(): boolean {
    return this.data.selection.mode !== "none";
  }

  /** 複数選択か */
  get isMultiSelect(): boolean {
    return this.data.selection.mode === "multi";
  }

  /** 単一選択か */
  get isSingleSelect(): boolean {
    return this.data.selection.mode === "single";
  }

  /** 選択中ID一覧 */
  get selectedIds(): string[] {
    return this.data.selection.selected;
  }

  /** 選択数 */
  get selectedCount(): number {
    return this.data.selection.selected.length;
  }

  /** 選択中の行 */
  get selectedRows(): RowVM[] {
    return (this.data.rows ?? []).filter((r) =>
      this.data.selection.selected.includes(r.id),
    );
  }

  /** 全選択か */
  get isAllSelected(): boolean {
    return (
      (this.data.rows ?? []).length > 0 &&
      this.data.selection.selected.length === (this.data.rows ?? []).length
    );
  }

  /** 一部のみ選択されている（indeterminate状態） */
  get isIndeterminate(): boolean {
    return (
      this.data.selection.selected.length > 0 &&
      this.data.selection.selected.length < (this.data.rows ?? []).length
    );
  }

  /** 選択状態: "none" | "some" | "all" */
  get selectionState(): "none" | "some" | "all" {
    if (this.data.selection.selected.length === 0) return "none";
    if (this.data.selection.selected.length === (this.data.rows ?? []).length)
      return "all";
    return "some";
  }

  /** 行が選択中か */
  isSelected(rowId: string): boolean {
    return this.data.selection.selected.includes(rowId);
  }

  // ============================================================
  // フィルター
  // ============================================================

  /** フィルター一覧 */
  get filters() {
    return this.data.filters?.named ?? [];
  }

  /** フィルターが存在するか */
  get hasFilters(): boolean {
    return (this.data.filters?.named?.length ?? 0) > 0;
  }

  /** アクティブなフィルター */
  get activeFilters() {
    return (this.data.filters?.named ?? []).filter((f) => f.active);
  }

  /** カスタムフィルター */
  get customFilter(): FilterExpression | undefined {
    return this.data.filters?.custom;
  }

  /** フィルターがアクティブか */
  isFilterActive(id: string): boolean {
    return (this.data.filters?.named ?? []).find((f) => f.id === id)?.active ?? false;
  }

  /** 指定したフィルターの条件式を取得 */
  getFilterExpression(filterId: string): FilterExpression | undefined {
    return (this.data.filters?.named ?? []).find((f) => f.id === filterId)?.filter;
  }

  /**
   * アクティブなフィルター条件を結合して取得
   * 複数のフィルターがアクティブな場合はANDで結合
   */
  get activeFilterExpression(): FilterExpression | undefined {
    const activeFilters = (this.data.filters?.named ?? []).filter(
      (f) => f.active && f.filter,
    );
    const customFilter = this.data.filters?.custom;

    const expressions: FilterExpression[] = [];
    for (const f of activeFilters) {
      if (f.filter) expressions.push(f.filter);
    }
    if (customFilter) expressions.push(customFilter);

    if (expressions.length === 0) return undefined;
    if (expressions.length === 1) return expressions[0];
    return { and: expressions };
  }

  /** 行がアクティブなフィルター条件にマッチするか判定 */
  rowMatchesFilter(row: RowVM): boolean {
    const filter = this.activeFilterExpression;
    if (!filter) return true;
    return evaluateFilter(filter, row.values as Record<string, unknown>);
  }

  /** アクティブなフィルター条件で行をフィルタリング（クライアントサイド） */
  filterRows(): RowVM[] {
    const filter = this.activeFilterExpression;
    if (!filter) return this.data.rows ?? [];
    return (this.data.rows ?? []).filter((row) =>
      evaluateFilter(filter, row.values as Record<string, unknown>),
    );
  }

  // ============================================================
  // ページネーション
  // ============================================================

  /** 現在ページ */
  get page(): number {
    return this.data.pagination?.page ?? 1;
  }

  /** ページサイズ */
  get pageSize(): number {
    return this.data.pagination?.pageSize ?? (this.data.rows ?? []).length;
  }

  /** 総件数 */
  get total(): number {
    return this.data.pagination?.totalCount ?? (this.data.rows ?? []).length;
  }

  /** 総ページ数 */
  get totalPages(): number {
    const size = this.data.pagination?.pageSize;
    const total = this.data.pagination?.totalCount;
    if (!size || !total) return 1;
    return Math.ceil(total / size);
  }

  /** 次ページがあるか */
  get hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  /** 前ページがあるか */
  get hasPrevPage(): boolean {
    return this.page > 1;
  }

  /** 最初のページか */
  get isFirstPage(): boolean {
    return this.page === 1;
  }

  /** 最後のページか */
  get isLastPage(): boolean {
    return this.page >= this.totalPages;
  }

  /** 現在表示中のレコード範囲（1始まり） */
  get pageRange(): { start: number; end: number } {
    const page = this.page;
    const size = this.pageSize;
    const total = this.total;
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return { start, end };
  }

  /** ページ情報文字列 "1-20 of 150" */
  get pageInfo(): string {
    const { start, end } = this.pageRange;
    const total = this.total;
    return `${start}-${end} of ${total}`;
  }

  // ============================================================
  // アクション
  // ============================================================

  /** ページアクション（選択不要） */
  get pageActions(): ActionVM[] {
    return this.data.pageActions ?? [];
  }

  /** 許可されたページアクション */
  get allowedPageActions(): ActionVM[] {
    return (this.data.pageActions ?? []).filter((a) => a.allowed);
  }

  /** バルクアクション */
  get bulkActions(): ActionVM[] {
    return this.data.bulkActions ?? [];
  }

  /** 許可されたバルクアクション */
  get allowedBulkActions(): ActionVM[] {
    return (this.data.bulkActions ?? []).filter((a) => a.allowed);
  }

  /** 行アクションを取得 */
  rowActions(row: RowVM): ActionVM[] {
    return row.actions;
  }

  /** 許可されたアクションのみ取得 */
  allowedActions(actions: ActionVM[]): ActionVM[] {
    return actions.filter((a) => a.allowed);
  }

  // ============================================================
  // 行
  // ============================================================

  /** 行一覧 */
  get rows(): RowVM[] {
    return this.data.rows ?? [];
  }

  /** 特定の行を取得 */
  row(id: string): RowVM | undefined {
    return (this.data.rows ?? []).find((r) => r.id === id);
  }

  /** 行数 */
  get rowCount(): number {
    return (this.data.rows ?? []).length;
  }

  /** 空か */
  get isEmpty(): boolean {
    return (this.data.rows ?? []).length === 0;
  }

  // ============================================================
  // セル
  // ============================================================

  /** セルの値を取得 */
  cellValue(row: RowVM, name: string): unknown {
    return row.values[name];
  }

  /** セルをフォーマット */
  formatCell(
    field: ListFieldVM,
    value: unknown,
    options?: FormatOptions,
  ): string {
    return Format.field(value, field, options);
  }

  // ============================================================
  // 状態
  // ============================================================

  /** ローディング中か */
  get isLoading(): boolean {
    return this.data.isLoading ?? false;
  }

  /** エラーメッセージ */
  get error(): string | undefined {
    return this.data.error;
  }

  // ============================================================
  // 行の状態
  // ============================================================

  /** ローディング中の行ID一覧 */
  get rowsLoadingIds(): string[] {
    return this.data.rowsLoading ?? [];
  }

  /** 行がローディング中か */
  isRowLoading(rowId: string): boolean {
    return this.data.rowsLoading?.includes(rowId) ?? false;
  }

  /** 行にエラーがあるか */
  hasRowErrors(rowId: string): boolean {
    return (this.data.rowErrors?.[rowId]?.length ?? 0) > 0;
  }

  /** 行のエラー一覧 */
  rowErrors(rowId: string): string[] {
    return this.data.rowErrors?.[rowId] ?? [];
  }

  // ============================================================
  // バルクアクション状態
  // ============================================================

  /** バルクアクションが実行中か */
  get isBulkActionInProgress(): boolean {
    return this.data.bulkActionInProgress != null;
  }

  /** 実行中のバルクアクションID */
  get bulkActionId(): string | undefined {
    return this.data.bulkActionInProgress;
  }

  /** バルクアクションの進捗 */
  get bulkProgress(): BulkActionProgress | undefined {
    return this.data.bulkActionProgress;
  }

  /** バルクアクションの進捗率（0-100） */
  get bulkProgressPercent(): number {
    const progress = this.data.bulkActionProgress;
    if (!progress || progress.total === 0) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  }

  // ============================================================
  // メタ
  // ============================================================

  /** ラベル */
  get label(): string {
    return this.data.label;
  }

  /** リソース名 */
  get resource(): string {
    return this.data.resource;
  }

  /** クリックアクション */
  get clickAction(): string | undefined {
    return this.data.clickAction;
  }

  // ============================================================
  // 状態更新（イミュータブル）- 新しいインスタンスを返す
  // ============================================================

  /** 検索クエリを更新 */
  setSearchQuery(query: string): ListVM {
    return new ListVM({
      ...this.data,
      search: { ...this.data.search, query },
    });
  }

  /** 検索をクリア */
  clearSearch(): ListVM {
    return new ListVM({
      ...this.data,
      search: { ...this.data.search, query: "" },
    });
  }

  /** フィルターをトグル */
  toggleFilter(filterId: string): ListVM {
    return new ListVM({
      ...this.data,
      filters: {
        ...this.data.filters,
        named: (this.data.filters?.named ?? []).map((f) =>
          f.id === filterId ? { ...f, active: !f.active } : f,
        ),
      },
    });
  }

  /** フィルターを設定 */
  setFilterActive(filterId: string, active: boolean): ListVM {
    return new ListVM({
      ...this.data,
      filters: {
        ...this.data.filters,
        named: (this.data.filters?.named ?? []).map((f) =>
          f.id === filterId ? { ...f, active } : f,
        ),
      },
    });
  }

  /** 全フィルターをクリア */
  clearFilters(): ListVM {
    return new ListVM({
      ...this.data,
      filters: {
        ...this.data.filters,
        named: (this.data.filters?.named ?? []).map((f) => ({ ...f, active: false })),
        custom: undefined,
      },
    });
  }

  /** カスタムフィルターを設定 */
  setCustomFilter(filter: FilterExpression | undefined): ListVM {
    return new ListVM({
      ...this.data,
      filters: {
        ...this.data.filters,
        custom: filter,
      },
    });
  }

  /** カスタムフィルターをクリア */
  clearCustomFilter(): ListVM {
    return new ListVM({
      ...this.data,
      filters: {
        ...this.data.filters,
        custom: undefined,
      },
    });
  }

  /** 行を選択/解除 */
  toggleSelect(rowId: string): ListVM {
    const selected = this.data.selection.selected.includes(rowId)
      ? this.data.selection.selected.filter((id) => id !== rowId)
      : [...this.data.selection.selected, rowId];
    return new ListVM({
      ...this.data,
      selection: { ...this.data.selection, selected },
    });
  }

  /** 全選択/全解除 */
  toggleSelectAll(): ListVM {
    const allSelected =
      (this.data.rows ?? []).length > 0 &&
      this.data.selection.selected.length === (this.data.rows ?? []).length;
    return new ListVM({
      ...this.data,
      selection: {
        ...this.data.selection,
        selected: allSelected ? [] : (this.data.rows ?? []).map((r) => r.id),
      },
    });
  }

  /** 選択をクリア */
  clearSelection(): ListVM {
    return new ListVM({
      ...this.data,
      selection: { ...this.data.selection, selected: [] },
    });
  }

  /** ソートを設定（単一） */
  setSort(field: string, order: "asc" | "desc"): ListVM {
    return new ListVM({
      ...this.data,
      sorts: [{ field, order }],
      defaultSort: { field, order },
    });
  }

  /** ソートをトグル（asc → desc → なし → asc） */
  toggleSort(field: string): ListVM {
    const sorts = this.sorts;
    const existing = sorts.find((s) => s.field === field);

    if (!existing) {
      // 新しいソートを追加（プライマリに）
      return new ListVM({
        ...this.data,
        sorts: [{ field, order: "asc" }, ...sorts],
        defaultSort: { field, order: "asc" },
      });
    }

    if (existing.order === "asc") {
      // asc → desc
      const newSorts = sorts.map((s) =>
        s.field === field ? { ...s, order: "desc" as const } : s,
      );
      return new ListVM({
        ...this.data,
        sorts: newSorts,
        defaultSort: newSorts[0],
      });
    }

    // desc → 削除
    const newSorts = sorts.filter((s) => s.field !== field);
    return new ListVM({
      ...this.data,
      sorts: newSorts.length > 0 ? newSorts : undefined,
      defaultSort: newSorts[0],
    });
  }

  /** ソートを追加（複数カラムソート） */
  addSort(field: string, order: "asc" | "desc"): ListVM {
    const sorts = this.sorts.filter((s) => s.field !== field);
    const newSorts = [...sorts, { field, order }];
    return new ListVM({
      ...this.data,
      sorts: newSorts,
      defaultSort: newSorts[0],
    });
  }

  /** ソートを削除 */
  removeSort(field: string): ListVM {
    const newSorts = this.sorts.filter((s) => s.field !== field);
    return new ListVM({
      ...this.data,
      sorts: newSorts.length > 0 ? newSorts : undefined,
      defaultSort: newSorts[0],
    });
  }

  /** 全ソートをクリア */
  clearSorts(): ListVM {
    return new ListVM({
      ...this.data,
      sorts: undefined,
      defaultSort: undefined,
    });
  }

  /** ソートをリセット（デフォルトに戻す） */
  resetSort(defaultSort?: SortVM): ListVM {
    return new ListVM({
      ...this.data,
      sorts: defaultSort ? [defaultSort] : undefined,
      defaultSort,
    });
  }

  /** ページを設定 */
  setPage(page: number): ListVM {
    if (!this.data.pagination) return this;
    return new ListVM({
      ...this.data,
      pagination: { ...this.data.pagination, page },
    });
  }

  /** ページサイズを設定 */
  setPageSize(pageSize: number): ListVM {
    if (!this.data.pagination) return this;
    return new ListVM({
      ...this.data,
      pagination: { ...this.data.pagination, pageSize, page: 1 },
    });
  }

  /** 次のページへ */
  nextPage(): ListVM {
    if (!this.data.pagination || !this.hasNextPage) return this;
    return new ListVM({
      ...this.data,
      pagination: {
        ...this.data.pagination,
        page: this.data.pagination.page + 1,
      },
    });
  }

  /** 前のページへ */
  prevPage(): ListVM {
    if (!this.data.pagination || !this.hasPrevPage) return this;
    return new ListVM({
      ...this.data,
      pagination: {
        ...this.data.pagination,
        page: this.data.pagination.page - 1,
      },
    });
  }

  /** 最初のページへ */
  firstPage(): ListVM {
    if (!this.data.pagination) return this;
    return new ListVM({
      ...this.data,
      pagination: { ...this.data.pagination, page: 1 },
    });
  }

  /** 最後のページへ */
  lastPage(): ListVM {
    if (!this.data.pagination) return this;
    return new ListVM({
      ...this.data,
      pagination: { ...this.data.pagination, page: this.totalPages },
    });
  }

  /** ローディング状態を設定 */
  setLoading(isLoading: boolean): ListVM {
    return new ListVM({
      ...this.data,
      isLoading,
    });
  }

  /** エラーを設定 */
  setError(error: string | undefined): ListVM {
    return new ListVM({
      ...this.data,
      error,
    });
  }

  /** 行データを更新 */
  setRows(rows: RowVM[], totalCount?: number): ListVM {
    return new ListVM({
      ...this.data,
      rows,
      pagination: this.data.pagination
        ? {
            ...this.data.pagination,
            totalCount: totalCount ?? this.data.pagination.totalCount,
          }
        : undefined,
    });
  }

  // ============================================================
  // 行のローディング・エラー状態更新
  // ============================================================

  /** 行のローディング状態を設定 */
  setRowLoading(rowId: string, isLoading: boolean): ListVM {
    const current = this.data.rowsLoading ?? [];
    const rowsLoading = isLoading
      ? current.includes(rowId)
        ? current
        : [...current, rowId]
      : current.filter((id) => id !== rowId);
    return new ListVM({
      ...this.data,
      rowsLoading: rowsLoading.length > 0 ? rowsLoading : undefined,
    });
  }

  /** 複数行のローディング状態を設定 */
  setRowsLoading(rowIds: string[], isLoading: boolean): ListVM {
    if (isLoading) {
      const current = this.data.rowsLoading ?? [];
      const newIds = rowIds.filter((id) => !current.includes(id));
      return new ListVM({
        ...this.data,
        rowsLoading: [...current, ...newIds],
      });
    }
    const rowsLoading = (this.data.rowsLoading ?? []).filter(
      (id) => !rowIds.includes(id),
    );
    return new ListVM({
      ...this.data,
      rowsLoading: rowsLoading.length > 0 ? rowsLoading : undefined,
    });
  }

  /** 行のエラーを設定 */
  setRowErrors(rowId: string, errors: string[]): ListVM {
    const current = this.data.rowErrors ?? {};
    if (errors.length === 0) {
      const { [rowId]: _, ...rest } = current;
      return new ListVM({
        ...this.data,
        rowErrors: Object.keys(rest).length > 0 ? rest : undefined,
      });
    }
    return new ListVM({
      ...this.data,
      rowErrors: { ...current, [rowId]: errors },
    });
  }

  /** 行のエラーをクリア */
  clearRowErrors(rowId: string): ListVM {
    return this.setRowErrors(rowId, []);
  }

  /** 全行のエラーをクリア */
  clearAllRowErrors(): ListVM {
    return new ListVM({
      ...this.data,
      rowErrors: undefined,
    });
  }

  // ============================================================
  // バルクアクション状態更新
  // ============================================================

  /** バルクアクションを開始 */
  startBulkAction(actionId: string, rowIds: string[]): ListVM {
    return new ListVM({
      ...this.data,
      bulkActionInProgress: actionId,
      bulkActionProgress: {
        total: rowIds.length,
        completed: 0,
        failed: 0,
        rowStatus: Object.fromEntries(rowIds.map((id) => [id, "pending"])),
      },
    });
  }

  /** バルクアクションの行ステータスを更新 */
  updateBulkRowStatus(
    rowId: string,
    status: "success" | "failed" | "skipped",
    error?: string,
  ): ListVM {
    if (!this.data.bulkActionProgress) return this;
    const rowStatus = {
      ...this.data.bulkActionProgress.rowStatus,
      [rowId]: status,
    };
    const rowErrors = error
      ? { ...this.data.bulkActionProgress.rowErrors, [rowId]: error }
      : this.data.bulkActionProgress.rowErrors;
    const completed =
      status === "success" || status === "skipped"
        ? this.data.bulkActionProgress.completed + 1
        : this.data.bulkActionProgress.completed;
    const failed =
      status === "failed"
        ? this.data.bulkActionProgress.failed + 1
        : this.data.bulkActionProgress.failed;
    return new ListVM({
      ...this.data,
      bulkActionProgress: {
        ...this.data.bulkActionProgress,
        completed,
        failed,
        rowStatus,
        rowErrors,
      },
    });
  }

  /** バルクアクションを完了 */
  completeBulkAction(): ListVM {
    return new ListVM({
      ...this.data,
      bulkActionInProgress: undefined,
    });
  }

  /** バルクアクションをキャンセル */
  cancelBulkAction(): ListVM {
    return new ListVM({
      ...this.data,
      bulkActionInProgress: undefined,
      bulkActionProgress: undefined,
    });
  }

  // ============================================================
  // APIクエリ生成
  // ============================================================

  /** APIクエリパラメータを生成 */
  toQueryParams(): Record<string, string | number | undefined> {
    const params: Record<string, string | number | undefined> = {};

    // ページネーション
    if (this.data.pagination) {
      params.page = this.data.pagination.page;
      params.per_page = this.data.pagination.pageSize;
    }

    // ソート
    const sorts = this.sorts;
    if (sorts.length > 0) {
      params.sort = sorts.map((s) => s.field).join(",");
      params.order = sorts.map((s) => s.order).join(",");
    }

    // 検索
    if (this.data.search.query) {
      params.search = this.data.search.query;
    }

    // フィルター（アクティブなnamed filter）
    const activeFilters = (this.data.filters?.named ?? []).filter((f) => f.active);
    if (activeFilters.length > 0) {
      params.filter = activeFilters.map((f) => f.id).join(",");
    }

    return params;
  }
}
