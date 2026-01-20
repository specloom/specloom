import { getContext, setContext } from "svelte";
import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "specloom";
import { ListHelpers, ActionHelpers } from "specloom";

const LIST_CONTEXT_KEY = Symbol("list-context");

export interface ListContextValue {
  // ViewModel (getter)
  readonly vm: ListViewModel;

  // Callbacks
  onSort?: (field: string) => void;
  onSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onAction?: (actionId: string, rowIds?: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowId: string) => void;
  onSearch?: (query: string) => void;
  onFilterToggle?: (filterId: string) => void;

  // Derived values
  readonly fields: ListFieldVM[];
  readonly rows: RowVM[];
  readonly headerActions: ActionVM[];
  readonly bulkActions: ActionVM[];
  readonly allowedHeaderActions: ActionVM[];
  readonly allowedBulkActions: ActionVM[];
  readonly selectedIds: string[];
  readonly selectedCount: number;
  readonly selectable: boolean;
  readonly multiSelect: boolean;
  readonly allSelected: boolean;
  readonly loading: boolean;
  readonly error: string | undefined;
  readonly empty: boolean;
  readonly page: number;
  readonly totalPages: number;
  readonly total: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
  readonly searchQuery: string;
  readonly searchFields: string[];
  readonly searchable: boolean;
  readonly filters: { id: string; label: string; active: boolean }[];
  readonly hasFilters: boolean;
}

export interface CreateListContextOptions {
  vm: () => ListViewModel;
  onSort?: (field: string) => void;
  onSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onAction?: (actionId: string, rowIds?: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowId: string) => void;
  onSearch?: (query: string) => void;
  onFilterToggle?: (filterId: string) => void;
}

export function createListContext(
  options: CreateListContextOptions,
): ListContextValue {
  const context: ListContextValue = {
    get vm() {
      return options.vm();
    },
    onSort: options.onSort,
    onSelect: options.onSelect,
    onSelectAll: options.onSelectAll,
    onAction: options.onAction,
    onPageChange: options.onPageChange,
    onRowClick: options.onRowClick,
    onSearch: options.onSearch,
    onFilterToggle: options.onFilterToggle,

    // Derived - 直接プロパティアクセス
    get fields() {
      return options.vm().fields;
    },
    get rows() {
      return options.vm().rows;
    },
    get headerActions() {
      return options.vm().headerActions;
    },
    get bulkActions() {
      return options.vm().bulkActions;
    },
    get allowedHeaderActions() {
      return ActionHelpers.allowed(options.vm().headerActions);
    },
    get allowedBulkActions() {
      return ActionHelpers.allowed(options.vm().bulkActions);
    },
    get selectedIds() {
      return options.vm().selection.selected;
    },
    get selectedCount() {
      return options.vm().selection.selected.length;
    },
    get selectable() {
      return options.vm().selection.mode !== "none";
    },
    get multiSelect() {
      return options.vm().selection.mode === "multi";
    },
    get allSelected() {
      return ListHelpers.allSelected(options.vm());
    },
    get loading() {
      return options.vm().isLoading ?? false;
    },
    get error() {
      return options.vm().error;
    },
    get empty() {
      return options.vm().rows.length === 0;
    },
    get page() {
      return options.vm().pagination?.page ?? 1;
    },
    get totalPages() {
      return ListHelpers.totalPages(options.vm());
    },
    get total() {
      return options.vm().pagination?.totalCount ?? options.vm().rows.length;
    },
    get hasNext() {
      return ListHelpers.hasNextPage(options.vm());
    },
    get hasPrev() {
      return ListHelpers.hasPrevPage(options.vm());
    },
    get searchQuery() {
      return options.vm().search.query;
    },
    get searchFields() {
      return options.vm().search.fields;
    },
    get searchable() {
      return options.vm().search.fields.length > 0;
    },
    get filters() {
      return options.vm().filters.named;
    },
    get hasFilters() {
      return options.vm().filters.named.length > 0;
    },
  };

  setContext(LIST_CONTEXT_KEY, context);
  return context;
}

export function getListContext(): ListContextValue {
  const context = getContext<ListContextValue>(LIST_CONTEXT_KEY);
  if (!context) {
    throw new Error("List components must be used within a ListView");
  }
  return context;
}
