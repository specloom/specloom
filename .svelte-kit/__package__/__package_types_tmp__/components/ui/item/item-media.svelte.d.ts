import { type VariantProps } from "tailwind-variants";
export declare const itemMediaVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        icon: string;
        image: string;
    };
}, undefined, "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none", {
    variant: {
        default: string;
        icon: string;
        image: string;
    };
}, undefined, import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        icon: string;
        image: string;
    };
}, undefined, "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none", unknown, unknown, undefined>>;
export type ItemMediaVariant = VariantProps<typeof itemMediaVariants>["variant"];
declare const ItemMedia: import("svelte").Component<any, {}, "ref">;
type ItemMedia = ReturnType<typeof ItemMedia>;
export default ItemMedia;
//# sourceMappingURL=item-media.svelte.d.ts.map