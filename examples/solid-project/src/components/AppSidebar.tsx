import { A, useLocation } from "@solidjs/router"
import { For } from "solid-js"

import { useSpecloom } from "@specloom/solidjs"
import { specCategories } from "~/admin/runtime"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar"

// Deduplicate shared resources (Department, Tag, Member etc.) across categories
function buildNavGroups() {
  const seen = new Set<string>()
  const groups: Array<{ category: string; resources: string[] }> = []

  // Dashboard first
  groups.push({ category: "Dashboard", resources: [] })

  for (const [category, resources] of Object.entries(specCategories)) {
    const unique = resources.filter((r) => !seen.has(r))
    unique.forEach((r) => seen.add(r))
    if (unique.length > 0) {
      groups.push({ category, resources: unique })
    }
  }

  return groups
}

const navGroups = buildNavGroups()

export function AppSidebar() {
  const location = useLocation()
  const client = useSpecloom()

  const resourceLabel = (name: string) => {
    const meta = client.spec.resources[name]?.meta
    return meta?.pluralLabel ?? meta?.label ?? name
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as={A} href="/">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SpecloomIcon />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Specloom</span>
                <span class="truncate text-xs text-muted-foreground">Spec Catalog</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <For each={navGroups}>
          {(group) => (
            <SidebarGroup>
              <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.category === "Dashboard" ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        as={A}
                        href="/"
                        isActive={location.pathname === "/"}
                        tooltip="Dashboard"
                      >
                        <LayoutDashboardIcon />
                        <span>Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    <For each={group.resources}>
                      {(resource) => {
                        const href = `/resources/${resource}`
                        return (
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              as={A}
                              href={href}
                              isActive={location.pathname.startsWith(href)}
                              tooltip={resourceLabel(resource)}
                            >
                              <ResourceIcon />
                              <span>{resourceLabel(resource)}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      }}
                    </For>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </For>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm">
              <div class="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                A
              </div>
              <span class="truncate">Admin User</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function SpecloomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}

function LayoutDashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}

function ResourceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}
