import type { ShowViewModel } from "specloom";
import type { Snippet } from "svelte";
interface Props {
    vm: ShowViewModel;
    onAction?: (actionId: string) => void;
    class?: string;
    children: Snippet;
}
declare const ShowView: import("svelte").Component<Props, {}, "">;
type ShowView = ReturnType<typeof ShowView>;
export default ShowView;
