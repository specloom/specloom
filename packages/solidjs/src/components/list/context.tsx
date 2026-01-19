import { createContext, useContext, type Accessor, type JSX } from "solid-js";
import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "specloom";
import { ListVM } from "specloom";

export interface ListContextValue {
  // ViewModel
  vm: Accessor<ListViewModel>;

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
  headerActions: Accessor<ActionVM[]>;
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
  const vm = () => props.vm;

  const value: ListContextValue = {
    vm,
    onSort: props.onSort,
    onSelect: props.onSelect,
    onSelectAll: props.onSelectAll,
    onAction: props.onAction,
    onPageChange: props.onPageChange,
    onRowClick: props.onRowClick,

    // Derived
    fields: () => ListVM.fields(vm()),
    rows: () => ListVM.rows(vm()),
    headerActions: () => ListVM.headerActions(vm()),
    bulkActions: () => ListVM.bulkActions(vm()),
    selectedIds: () => ListVM.selectedIds(vm()),
    selectedCount: () => ListVM.selectedCount(vm()),
    selectable: () => ListVM.selectable(vm()),
    multiSelect: () => ListVM.multiSelect(vm()),
    allSelected: () => ListVM.allSelected(vm()),
    loading: () => ListVM.loading(vm()),
    error: () => ListVM.error(vm()),
    empty: () => ListVM.empty(vm()),
    page: () => ListVM.page(vm()),
    totalPages: () => ListVM.totalPages(vm()),
    total: () => ListVM.total(vm()),
    hasNext: () => ListVM.hasNext(vm()),
    hasPrev: () => ListVM.hasPrev(vm()),
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
