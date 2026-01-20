import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet<[{
        canSubmit: boolean;
        submitting: boolean;
    }]>;
}
declare const FormFooter: import("svelte").Component<Props, {}, "">;
type FormFooter = ReturnType<typeof FormFooter>;
export default FormFooter;
