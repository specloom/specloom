<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ActionVM } from "specloom";
  import { getListContext } from "./context.svelte.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ actions: ActionVM[]; selectedIds: string[]; selectedCount: number }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();
</script>

{#if ctx.selectedCount > 0}
  <div class={cn("flex items-center gap-2", className)}>
    {#if children}
      {@render children({ actions: ctx.allowedBulkActions, selectedIds: ctx.selectedIds, selectedCount: ctx.selectedCount })}
    {:else}
      <span class="text-sm text-muted-foreground">{ctx.selectedCount}件選択中</span>
      {#each ctx.allowedBulkActions as action}
        <Button
          variant={action.ui?.variant === "danger" ? "destructive" : "secondary"}
          onclick={() => ctx.onAction?.(action.id, ctx.selectedIds)}
        >
          {action.label}
        </Button>
      {/each}
    {/if}
  </div>
{/if}
