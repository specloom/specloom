import type { Snippet } from "svelte";
import type { FieldGroup, ShowFieldVM } from "specloom";
interface Props {
    group: FieldGroup;
    class?: string;
    children?: Snippet<[{
        group: FieldGroup;
        fields: ShowFieldVM[];
    }]>;
}
declare const ShowGroup: import("svelte").Component<Props, {}, "">;
type ShowGroup = ReturnType<typeof ShowGroup>;
export default ShowGroup;
