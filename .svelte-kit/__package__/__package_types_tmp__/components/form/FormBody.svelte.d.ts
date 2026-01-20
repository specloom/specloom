import type { Snippet } from "svelte";
import type { FormFieldVM, FieldGroup } from "specloom";
interface Props {
    class?: string;
    children?: Snippet<[{
        fields: FormFieldVM[];
        groups: FieldGroup[];
    }]>;
}
declare const FormBody: import("svelte").Component<Props, {}, "">;
type FormBody = ReturnType<typeof FormBody>;
export default FormBody;
//# sourceMappingURL=FormBody.svelte.d.ts.map