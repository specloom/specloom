import type { FormViewModel } from "specloom";
import type { Snippet } from "svelte";
import { type RelationOption } from "./context.svelte.js";
interface Props {
    vm: FormViewModel;
    onChange: (name: string, value: unknown) => void;
    onSubmit: () => void;
    onAction?: (actionId: string) => void;
    onOptionsSearch?: (resource: string, query: string) => Promise<RelationOption[]>;
    /** Timezone for date/datetime formatting (e.g., 'Asia/Tokyo', 'UTC'). undefined = local time */
    timeZone?: string;
    class?: string;
    children: Snippet;
}
declare const FormView: import("svelte").Component<Props, {}, "">;
type FormView = ReturnType<typeof FormView>;
export default FormView;
