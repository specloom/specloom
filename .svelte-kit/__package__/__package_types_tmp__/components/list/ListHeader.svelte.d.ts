import type { Snippet } from "svelte";
import type { ListFieldVM } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        fields: ListFieldVM[];
    }]>;
}
declare const ListHeader: import("svelte").Component<Props, {}, "">;
type ListHeader = ReturnType<typeof ListHeader>;
export default ListHeader;
//# sourceMappingURL=ListHeader.svelte.d.ts.map