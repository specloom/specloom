<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ActionVM } from "specloom";
  import { getListContext } from "./context.svelte.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ actions: ActionVM[] }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();
</script>

<div class={cn("flex items-center gap-2", className)}>
  {#if children}
    {@render children({ actions: ctx.allowedHeaderActions })}
  {:else}
    {#each ctx.allowedHeaderActions as action}
      <Button
        variant={action.ui?.variant === "primary" ? "default" : "outline"}
        onclick={() => ctx.onAction?.(action.id)}
      >
        {action.label}
      </Button>
    {/each}
  {/if}
</div>
