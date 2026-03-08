// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "@fontsource/inter";
import "./app.css";

import {
  SidebarProvider,
  SidebarInset,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";

export default function App() {
  return (
    <Router
      root={(props) => (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{props.children}</SidebarInset>
        </SidebarProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
