import type { Snippet } from "svelte";
import type { RowVM, ActionVM } from "specloom";
interface Props {
    row: RowVM;
    class?: string;
    children?: Snippet<[{
        row: RowVM;
        selected: boolean;
        actions: ActionVM[];
    }]>;
}
declare const ListRow: import("svelte").Component<Props, {}, "">;
type ListRow = ReturnType<typeof ListRow>;
export default ListRow;
//# sourceMappingURL=ListRow.svelte.d.ts.map