import type { Snippet } from "svelte";
import type { FormFieldVM } from "specloom";
interface Props {
    field: FormFieldVM;
    class?: string;
    children?: Snippet<[{
        field: FormFieldVM;
        value: unknown;
        onChange: (value: unknown) => void;
    }]>;
}
declare const FormField: import("svelte").Component<Props, {}, "">;
type FormField = ReturnType<typeof FormField>;
export default FormField;
//# sourceMappingURL=FormField.svelte.d.ts.map