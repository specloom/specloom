<script lang="ts">
  import { page } from "$app/stores";
  import LayoutGrid from "@lucide/svelte/icons/layout-grid";
  import Users from "@lucide/svelte/icons/users";
  import Package from "@lucide/svelte/icons/package";
  import ShoppingCart from "@lucide/svelte/icons/shopping-cart";
  import FileText from "@lucide/svelte/icons/file-text";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import User from "@lucide/svelte/icons/user";
  import type { Component } from "svelte";

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

  let sidebarOpen = $state(true);

  function isActive(href: string): boolean {
    return $page.url.pathname.startsWith(href);
  }

  function getCurrentLabel(): string {
    const item = navItems.find((item) => isActive(item.href));
    return item?.label ?? "Dashboard";
  }

  let { children } = $props();
</script>

<div class="flex h-screen bg-muted/40">
  <!-- Sidebar -->
  <aside
    class="{sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r border-border flex flex-col transition-all duration-300 shadow-sm"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center gap-2 px-4 border-b border-border">
      <div class="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <LayoutGrid class="h-4 w-4" />
      </div>
      <span class="text-base font-semibold text-foreground">
        {sidebarOpen ? "Specloom Admin" : "S"}
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-2 py-4">
      {#each navItems as item}
        <a
          href={item.href}
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {isActive(item.href) ? 'text-foreground bg-accent border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}"
        >
          <item.icon class="h-4 w-4" />
          {#if sidebarOpen}
            <span>{item.label}</span>
          {/if}
        </a>
      {/each}
    </nav>

    <!-- Toggle Button -->
    <div class="p-4 border-t border-border">
      <button
        type="button"
        class="w-full flex items-center justify-center h-9 rounded-md hover:bg-accent transition-colors"
        onclick={() => (sidebarOpen = !sidebarOpen)}
      >
        {#if sidebarOpen}
          <ChevronLeft class="h-4 w-4" />
        {:else}
          <ChevronRight class="h-4 w-4" />
        {/if}
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      <h1 class="text-lg font-medium text-foreground">
        {getCurrentLabel()}
      </h1>
      <div class="flex items-center gap-4">
        <span class="text-sm text-muted-foreground">管理者</span>
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User class="h-4 w-4" />
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 overflow-auto p-6">
      {@render children()}
    </main>
  </div>
</div>
