import type { Snippet } from "svelte";
import type { ActionVM } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        actions: ActionVM[];
    }]>;
}
declare const ListHeaderActions: import("svelte").Component<Props, {}, "">;
type ListHeaderActions = ReturnType<typeof ListHeaderActions>;
export default ListHeaderActions;
//# sourceMappingURL=ListHeaderActions.svelte.d.ts.map