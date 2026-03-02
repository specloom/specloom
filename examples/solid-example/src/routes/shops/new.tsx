import { SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";

export default function ShopNew() {
  return (
    <>
      <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <h1 class="text-lg font-semibold">New Shop</h1>
      </header>
      <div class="flex-1 p-4">
        <p class="text-muted-foreground">New shop form will go here.</p>
      </div>
    </>
  );
}
