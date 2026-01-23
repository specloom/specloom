import { createContext, useContext, type Accessor, type JSX } from "solid-js";
import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "specloom";
import { ListVM } from "specloom";

export interface ListContextValue {
  // ViewModel (OOP instance)
  vm: Accessor<ListVM>;

  // Callbacks
  onSort?: (field: string) => void;
  onSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onAction?: (actionId: string, rowIds?: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowId: string) => void;

  // Derived values (for convenience)
  fields: Accessor<ListFieldVM[]>;
  rows: Accessor<RowVM[]>;
  pageActions: Accessor<ActionVM[]>;
  bulkActions: Accessor<ActionVM[]>;
  selectedIds: Accessor<string[]>;
  selectedCount: Accessor<number>;
  selectable: Accessor<boolean>;
  multiSelect: Accessor<boolean>;
  allSelected: Accessor<boolean>;
  loading: Accessor<boolean>;
  error: Accessor<string | undefined>;
  empty: Accessor<boolean>;
  page: Accessor<number>;
  totalPages: Accessor<number>;
  total: Accessor<number>;
  hasNext: Accessor<boolean>;
  hasPrev: Accessor<boolean>;
}

const ListContext = createContext<ListContextValue>();

export interface ListProviderProps {
  vm: ListViewModel;
  onSort?: (field: string) => void;
  onSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onAction?: (actionId: string, rowIds?: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowId: string) => void;
  children: JSX.Element;
}

export function ListProvider(props: ListProviderProps) {
  // Wrap plain data in ListVM instance
  const vm = () => new ListVM(props.vm);

  const value: ListContextValue = {
    vm,
    onSort: props.onSort,
    onSelect: props.onSelect,
    onSelectAll: props.onSelectAll,
    onAction: props.onAction,
    onPageChange: props.onPageChange,
    onRowClick: props.onRowClick,

    // Derived (OOP style)
    fields: () => vm().fields,
    rows: () => vm().rows,
    pageActions: () => vm().pageActions,
    bulkActions: () => vm().bulkActions,
    selectedIds: () => vm().selectedIds,
    selectedCount: () => vm().selectedCount,
    selectable: () => vm().isSelectable,
    multiSelect: () => vm().isMultiSelect,
    allSelected: () => vm().isAllSelected,
    loading: () => vm().isLoading,
    error: () => vm().error,
    empty: () => vm().isEmpty,
    page: () => vm().page,
    totalPages: () => vm().totalPages,
    total: () => vm().total,
    hasNext: () => vm().hasNextPage,
    hasPrev: () => vm().hasPrevPage,
  };

  return (
    <ListContext.Provider value={value}>{props.children}</ListContext.Provider>
  );
}

export function useList(): ListContextValue {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used within a ListView");
  }
  return context;
}
