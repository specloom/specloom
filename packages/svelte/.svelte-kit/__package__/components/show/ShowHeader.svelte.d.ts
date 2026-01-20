import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet<[{
        label: string;
        id: string;
    }]>;
}
declare const ShowHeader: import("svelte").Component<Props, {}, "">;
type ShowHeader = ReturnType<typeof ShowHeader>;
export default ShowHeader;
