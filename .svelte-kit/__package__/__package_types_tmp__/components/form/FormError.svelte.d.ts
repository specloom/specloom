import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet<[{
        error: string;
    }]>;
}
declare const FormError: import("svelte").Component<Props, {}, "">;
type FormError = ReturnType<typeof FormError>;
export default FormError;
//# sourceMappingURL=FormError.svelte.d.ts.map