<script lang="ts">
  import type { Snippet } from "svelte";
  import { getListContext } from "./context.svelte.js";
  import { cn } from "$lib/utils.js";
  import ListHeaderActions from "./ListHeaderActions.svelte";
  import ListBulkActions from "./ListBulkActions.svelte";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();
</script>

<div class={cn("flex items-center justify-between border-b p-4", className)}>
  {#if children}
    {@render children()}
  {:else}
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">
        {ctx.total}件
      </span>
      <ListBulkActions />
    </div>
    <ListHeaderActions />
  {/if}
</div>
