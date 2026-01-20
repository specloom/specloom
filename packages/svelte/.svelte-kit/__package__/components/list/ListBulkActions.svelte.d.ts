import type { Snippet } from "svelte";
import type { ActionVM } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        actions: ActionVM[];
        selectedIds: string[];
        selectedCount: number;
    }]>;
}
declare const ListBulkActions: import("svelte").Component<Props, {}, "">;
type ListBulkActions = ReturnType<typeof ListBulkActions>;
export default ListBulkActions;
