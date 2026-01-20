import { type VariantProps } from "tailwind-variants";
export declare const fieldVariants: import("tailwind-variants").TVReturnType<{
    orientation: {
        vertical: string;
        horizontal: string[];
        responsive: string[];
    };
}, undefined, "group/field data-[invalid=true]:text-destructive flex w-full gap-3", {
    orientation: {
        vertical: string;
        horizontal: string[];
        responsive: string[];
    };
}, undefined, import("tailwind-variants").TVReturnType<{
    orientation: {
        vertical: string;
        horizontal: string[];
        responsive: string[];
    };
}, undefined, "group/field data-[invalid=true]:text-destructive flex w-full gap-3", unknown, unknown, undefined>>;
export type FieldOrientation = VariantProps<typeof fieldVariants>["orientation"];
declare const Field: import("svelte").Component<any, {}, "ref">;
type Field = ReturnType<typeof Field>;
export default Field;
//# sourceMappingURL=field.svelte.d.ts.map