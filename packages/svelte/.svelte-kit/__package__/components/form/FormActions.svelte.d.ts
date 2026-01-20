import type { Snippet } from "svelte";
import type { ActionVM } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        actions: ActionVM[];
    }]>;
}
declare const FormActions: import("svelte").Component<Props, {}, "">;
type FormActions = ReturnType<typeof FormActions>;
export default FormActions;
