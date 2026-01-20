import { type VariantProps } from "tailwind-variants";
export declare const buttonGroupVariants: import("tailwind-variants").TVReturnType<{
    orientation: {
        horizontal: string;
        vertical: string;
    };
}, undefined, "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1", {
    orientation: {
        horizontal: string;
        vertical: string;
    };
}, undefined, import("tailwind-variants").TVReturnType<{
    orientation: {
        horizontal: string;
        vertical: string;
    };
}, undefined, "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1", unknown, unknown, undefined>>;
export type ButtonGroupOrientation = VariantProps<typeof buttonGroupVariants>["orientation"];
import { type WithElementRef } from "../../../utils.js";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: ButtonGroupOrientation;
};
declare const ButtonGroup: import("svelte").Component<$$ComponentProps, {}, "ref">;
type ButtonGroup = ReturnType<typeof ButtonGroup>;
export default ButtonGroup;
