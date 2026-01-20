import { getContext, setContext } from "svelte";
import { ListHelpers, ActionHelpers } from "specloom";
const LIST_CONTEXT_KEY = Symbol("list-context");
export function createListContext(options) {
    const context = {
        get vm() {
            return options.vm();
        },
        onSort: options.onSort,
        onSelect: options.onSelect,
        onSelectAll: options.onSelectAll,
        onAction: options.onAction,
        onPageChange: options.onPageChange,
        onRowClick: options.onRowClick,
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
            return options.vm().pagination?.totalCount ?? 0;
        },
        get hasNext() {
            return ListHelpers.hasNextPage(options.vm());
        },
        get hasPrev() {
            return ListHelpers.hasPrevPage(options.vm());
        },
    };
    setContext(LIST_CONTEXT_KEY, context);
    return context;
}
export function getListContext() {
    const context = getContext(LIST_CONTEXT_KEY);
    if (!context) {
        throw new Error("List components must be used within a ListView");
    }
    return context;
}
