import type { ListViewModel, ListFieldVM, RowVM, ActionVM } from "specloom";
export interface ListContextValue {
    readonly vm: ListViewModel;
    onSort?: (field: string) => void;
    onSelect?: (rowId: string) => void;
    onSelectAll?: () => void;
    onAction?: (actionId: string, rowIds?: string[]) => void;
    onPageChange?: (page: number) => void;
    onRowClick?: (rowId: string) => void;
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
}
export interface CreateListContextOptions {
    vm: () => ListViewModel;
    onSort?: (field: string) => void;
    onSelect?: (rowId: string) => void;
    onSelectAll?: () => void;
    onAction?: (actionId: string, rowIds?: string[]) => void;
    onPageChange?: (page: number) => void;
    onRowClick?: (rowId: string) => void;
}
export declare function createListContext(options: CreateListContextOptions): ListContextValue;
export declare function getListContext(): ListContextValue;
//# sourceMappingURL=context.svelte.d.ts.map