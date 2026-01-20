import type { Snippet } from "svelte";
import type { RowVM } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        rows: RowVM[];
    }]>;
}
declare const ListBody: import("svelte").Component<Props, {}, "">;
type ListBody = ReturnType<typeof ListBody>;
export default ListBody;
//# sourceMappingURL=ListBody.svelte.d.ts.map