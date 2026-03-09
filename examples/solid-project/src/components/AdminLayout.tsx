import type { JSX } from "solid-js";

import { I18nProvider, SpecloomProvider } from "@specloom/solidjs";
import { createRuntime } from "~/admin/runtime";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { AppSidebar } from "~/components/AppSidebar";

type AdminLayoutProps = {
  children: JSX.Element;
};

const runtime = createRuntime();

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <I18nProvider>
    <SpecloomProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 h-4" />
            <span class="text-sm font-medium text-muted-foreground">
              Specloom Admin
            </span>
          </header>
          <div class="flex-1 p-4">{props.children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SpecloomProvider>
    </I18nProvider>
  );
}
