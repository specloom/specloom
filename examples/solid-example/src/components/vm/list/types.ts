import type { ListVM } from "specloom";

export interface ResourceListProps {
  vm: ListVM;
  basePath: string;
  total?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onSortChange?: (field: string, order: "asc" | "desc") => void;
  onSearchChange?: (query: string) => void;
  onAction?: (actionId: string, rowId?: string) => void;
  onBulkAction?: (actionId: string, selectedIds: string[]) => void;
}
