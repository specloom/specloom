import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet;
}
declare const ListLoading: import("svelte").Component<Props, {}, "">;
type ListLoading = ReturnType<typeof ListLoading>;
export default ListLoading;
