import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet;
}
declare const FormLoading: import("svelte").Component<Props, {}, "">;
type FormLoading = ReturnType<typeof FormLoading>;
export default FormLoading;
