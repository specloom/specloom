import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet;
}
declare const ShowLoading: import("svelte").Component<Props, {}, "">;
type ShowLoading = ReturnType<typeof ShowLoading>;
export default ShowLoading;
