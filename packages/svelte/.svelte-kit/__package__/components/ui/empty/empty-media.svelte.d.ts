import { type VariantProps } from "tailwind-variants";
export declare const emptyMediaVariants: import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        icon: string;
    };
}, undefined, "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
    variant: {
        default: string;
        icon: string;
    };
}, undefined, import("tailwind-variants").TVReturnType<{
    variant: {
        default: string;
        icon: string;
    };
}, undefined, "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", unknown, unknown, undefined>>;
export type EmptyMediaVariant = VariantProps<typeof emptyMediaVariants>["variant"];
import { type WithElementRef } from "../../../utils.js";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: EmptyMediaVariant;
};
declare const EmptyMedia: import("svelte").Component<$$ComponentProps, {}, "ref">;
type EmptyMedia = ReturnType<typeof EmptyMedia>;
export default EmptyMedia;
