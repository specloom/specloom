import type { Snippet } from "svelte";
interface Props {
    class?: string;
    children?: Snippet<[{
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }]>;
}
declare const ListPagination: import("svelte").Component<Props, {}, "">;
type ListPagination = ReturnType<typeof ListPagination>;
export default ListPagination;
