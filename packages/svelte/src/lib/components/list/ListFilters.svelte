<script lang="ts">
  import type { Snippet } from "svelte";
  import FilterIcon from "@lucide/svelte/icons/filter";
  import { getListContext } from "./context.svelte.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ filters: { id: string; label: string; active: boolean }[] }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();

  const activeCount = $derived(ctx.filters.filter((f) => f.active).length);
</script>

{#if ctx.hasFilters}
  <div class={cn("flex items-center gap-2", className)}>
    {#if children}
      {@render children({ filters: ctx.filters })}
    {:else}
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <FilterIcon class="h-4 w-4" />
        <span>フィルター:</span>
      </div>
      <div class="flex flex-wrap items-center gap-1">
        {#each ctx.filters as filter (filter.id)}
          <Button
            variant={filter.active ? "default" : "outline"}
            size="sm"
            class="h-7 px-2 text-xs"
            onclick={() => ctx.onFilterToggle?.(filter.id)}
          >
            {filter.label}
          </Button>
        {/each}
      </div>
      {#if activeCount > 0}
        <Badge variant="secondary" class="ml-1">
          {activeCount}件適用中
        </Badge>
      {/if}
    {/if}
  </div>
{/if}
