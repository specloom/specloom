import type { ListViewModel } from "specloom";
import type { Snippet } from "svelte";
interface Props {
    vm: ListViewModel;
    onSort?: (field: string) => void;
    onSelect?: (rowId: string) => void;
    onSelectAll?: () => void;
    onAction?: (actionId: string, rowIds?: string[]) => void;
    onPageChange?: (page: number) => void;
    onRowClick?: (rowId: string) => void;
    class?: string;
    children: Snippet;
}
declare const ListView: import("svelte").Component<Props, {}, "">;
type ListView = ReturnType<typeof ListView>;
export default ListView;
