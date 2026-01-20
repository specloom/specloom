import { type WithoutChildrenOrChild } from "$lib/utils.js";
import DropdownMenuPortal from "./dropdown-menu-portal.svelte";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import type { ComponentProps } from "svelte";
type $$ComponentProps = DropdownMenuPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DropdownMenuPortal>>;
};
declare const DropdownMenuContent: import("svelte").Component<$$ComponentProps, {}, "ref">;
type DropdownMenuContent = ReturnType<typeof DropdownMenuContent>;
export default DropdownMenuContent;
//# sourceMappingURL=dropdown-menu-content.svelte.d.ts.map