import { type VariantProps } from "tailwind-variants";
export declare const itemVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        outline: string;
        muted: string;
    };
    size: {
        default: string;
        sm: string;
    };
}, undefined, "group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors", {
    variant: {
        default: string;
        outline: string;
        muted: string;
    };
    size: {
        default: string;
        sm: string;
    };
}, undefined, import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        outline: string;
        muted: string;
    };
    size: {
        default: string;
        sm: string;
    };
}, undefined, "group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-wrap items-center rounded-md border border-transparent text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors", unknown, unknown, undefined>>;
export type ItemSize = VariantProps<typeof itemVariants>["size"];
export type ItemVariant = VariantProps<typeof itemVariants>["variant"];
declare const Item: import("svelte").Component<any, {}, "ref">;
type Item = ReturnType<typeof Item>;
export default Item;
//# sourceMappingURL=item.svelte.d.ts.map