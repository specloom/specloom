import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet<[{
        label: string;
        mode: "create" | "edit";
    }]>;
}
declare const FormHeader: import("svelte").Component<Props, {}, "">;
type FormHeader = ReturnType<typeof FormHeader>;
export default FormHeader;
//# sourceMappingURL=FormHeader.svelte.d.ts.map