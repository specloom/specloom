import type { Snippet } from "svelte";
import type { ActionVM } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        actions: ActionVM[];
    }]>;
}
declare const ShowActions: import("svelte").Component<Props, {}, "">;
type ShowActions = ReturnType<typeof ShowActions>;
export default ShowActions;
