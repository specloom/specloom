<script lang="ts">
  import type { Snippet } from "svelte";
  import { getListContext } from "./context.svelte.js";
  import { cn } from "$lib/utils.js";
  import ListHeaderActions from "./ListHeaderActions.svelte";
  import ListBulkActions from "./ListBulkActions.svelte";
  import ListSearch from "./ListSearch.svelte";
  import ListFilters from "./ListFilters.svelte";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();

  const showFiltersRow = $derived(ctx.hasFilters);
</script>

<div class={cn("border-b", className)}>
  {#if children}
    {@render children()}
  {:else}
    <div class="flex items-center justify-between gap-4 p-4">
      <div class="flex items-center gap-4">
        <span class="text-sm text-muted-foreground">
          {ctx.total}件
        </span>
        {#if ctx.searchable}
          <ListSearch class="w-64" />
        {/if}
        <ListBulkActions />
      </div>
      <ListHeaderActions />
    </div>
    {#if showFiltersRow}
      <div class="border-t px-4 py-2 bg-muted/30">
        <ListFilters />
      </div>
    {/if}
  {/if}
</div>
