import type { Snippet } from "svelte";
import type { FieldGroup, FormFieldVM } from "specloom";
interface Props {
    group: FieldGroup;
    class?: string;
    children?: Snippet<[{
        group: FieldGroup;
        fields: FormFieldVM[];
    }]>;
}
declare const FormGroup: import("svelte").Component<Props, {}, "">;
type FormGroup = ReturnType<typeof FormGroup>;
export default FormGroup;
