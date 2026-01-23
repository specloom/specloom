import { getContext, setContext } from "svelte";
import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "specloom";
import { ListVM } from "specloom";

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
  readonly pageActions: ActionVM[];
  readonly bulkActions: ActionVM[];
  readonly allowedPageActions: ActionVM[];
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
  // Wrap plain data in ListVM instance
  const getVM = () => new ListVM(options.vm());

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

    // Derived - OOP style via ListVM
    get fields() {
      return getVM().fields;
    },
    get rows() {
      return getVM().rows;
    },
    get pageActions() {
      return getVM().pageActions;
    },
    get bulkActions() {
      return getVM().bulkActions;
    },
    get allowedPageActions() {
      return getVM().allowedPageActions;
    },
    get allowedBulkActions() {
      return getVM().allowedBulkActions;
    },
    get selectedIds() {
      return getVM().selectedIds;
    },
    get selectedCount() {
      return getVM().selectedCount;
    },
    get selectable() {
      return getVM().isSelectable;
    },
    get multiSelect() {
      return getVM().isMultiSelect;
    },
    get allSelected() {
      return getVM().isAllSelected;
    },
    get loading() {
      return getVM().isLoading;
    },
    get error() {
      return getVM().error;
    },
    get empty() {
      return getVM().isEmpty;
    },
    get page() {
      return getVM().page;
    },
    get totalPages() {
      return getVM().totalPages;
    },
    get total() {
      return getVM().total;
    },
    get hasNext() {
      return getVM().hasNextPage;
    },
    get hasPrev() {
      return getVM().hasPrevPage;
    },
    get searchQuery() {
      return getVM().searchQuery;
    },
    get searchFields() {
      return getVM().searchFields;
    },
    get searchable() {
      return getVM().isSearchable;
    },
    get filters() {
      return getVM().filters;
    },
    get hasFilters() {
      return getVM().hasFilters;
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
