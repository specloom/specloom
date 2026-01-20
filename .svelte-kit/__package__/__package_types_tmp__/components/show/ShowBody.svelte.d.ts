import type { Snippet } from "svelte";
import type { ShowFieldVM, FieldGroup } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        fields: ShowFieldVM[];
        groups: FieldGroup[];
    }]>;
}
declare const ShowBody: import("svelte").Component<Props, {}, "">;
type ShowBody = ReturnType<typeof ShowBody>;
export default ShowBody;
//# sourceMappingURL=ShowBody.svelte.d.ts.map