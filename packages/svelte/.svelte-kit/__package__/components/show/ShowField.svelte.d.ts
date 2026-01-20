import type { Snippet } from "svelte";
import type { ShowFieldVM } from "specloom";
interface Props {
    field: ShowFieldVM;
    class?: string;
    children?: Snippet<[{
        field: ShowFieldVM;
        value: unknown;
        formatted: string;
    }]>;
}
declare const ShowField: import("svelte").Component<Props, {}, "">;
type ShowField = ReturnType<typeof ShowField>;
export default ShowField;
