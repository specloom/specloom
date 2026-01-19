import { A, useLocation } from "@solidjs/router";
import { createSignal, type Component, type JSX } from "solid-js";
import { Button } from "@specloom/solidjs";
import {
  LayoutGrid,
  Users,
  Package,
  ShoppingCart,
  FileText,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-solid";

interface NavItem {
  href: string;
  label: string;
  icon: Component<{ class?: string }>;
}

const navItems: NavItem[] = [
  { href: "/users", label: "ユーザー", icon: Users },
  { href: "/products", label: "商品", icon: Package },
  { href: "/orders", label: "注文", icon: ShoppingCart },
  { href: "/posts", label: "投稿", icon: FileText },
];

export function AdminLayout(props: { children: JSX.Element }) {
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <div class="flex h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        class={`${sidebarOpen() ? "w-64" : "w-16"} bg-card border-r border-border flex flex-col transition-all duration-300 shadow-sm`}
      >
        {/* Logo */}
        <div class="h-16 flex items-center gap-2 px-4 border-b border-border">
          <div class="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <LayoutGrid class="h-4 w-4" />
          </div>
          <span class="text-base font-semibold text-foreground">
            {sidebarOpen() ? "Specloom Admin" : "S"}
          </span>
        </div>

        {/* Navigation */}
        <nav class="flex-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <A
                href={item.href}
                class={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-foreground bg-accent border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon class="h-4 w-4" />
                {sidebarOpen() && <span>{item.label}</span>}
              </A>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div class="p-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="w-full"
            onClick={() => setSidebarOpen(!sidebarOpen())}
          >
            {sidebarOpen() ? (
              <ChevronLeft class="h-4 w-4" />
            ) : (
              <ChevronRight class="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div class="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header class="h-16 bg-background border-b border-border flex items-center justify-between px-6">
          <h1 class="text-lg font-medium text-foreground">
            {navItems.find((item) => isActive(item.href))?.label ?? "Dashboard"}
          </h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted-foreground">管理者</span>
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <User class="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main class="flex-1 overflow-auto p-6">{props.children}</main>
      </div>
    </div>
  );
}
