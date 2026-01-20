import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet<[{
        error: string;
    }]>;
}
declare const ShowError: import("svelte").Component<Props, {}, "">;
type ShowError = ReturnType<typeof ShowError>;
export default ShowError;
//# sourceMappingURL=ShowError.svelte.d.ts.map