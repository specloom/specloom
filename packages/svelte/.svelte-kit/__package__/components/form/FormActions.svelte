<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ActionVM } from "specloom";
  import { getFormContext } from "./context.svelte.js";
  import { Button } from "../ui/button/index.js";
  import { cn } from "../../utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ actions: ActionVM[] }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getFormContext();
</script>

{#if ctx.allowedActions.length > 0}
  <div class={cn("flex items-center gap-2", className)}>
    {#if children}
      {@render children({ actions: ctx.allowedActions })}
    {:else}
      {#each ctx.allowedActions as action}
        <Button
          type="button"
          variant="outline"
          onclick={() => ctx.onAction?.(action.id)}
        >
          {action.label}
        </Button>
      {/each}
    {/if}
  </div>
{/if}
