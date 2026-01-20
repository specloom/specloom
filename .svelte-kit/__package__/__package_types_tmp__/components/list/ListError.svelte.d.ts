import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet<[{
        error: string;
    }]>;
}
declare const ListError: import("svelte").Component<Props, {}, "">;
type ListError = ReturnType<typeof ListError>;
export default ListError;
//# sourceMappingURL=ListError.svelte.d.ts.map