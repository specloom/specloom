<script lang="ts">
  import type { Snippet } from "svelte";
  import { getShowContext } from "./context.svelte.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
  const ctx = getShowContext();
</script>

{#if ctx.loading}
  <div class={cn("flex items-center justify-center py-12", className)}>
    {#if children}
      {@render children()}
    {:else}
      <Spinner class="h-6 w-6" />
      <span class="ml-2 text-sm text-muted-foreground">読み込み中...</span>
    {/if}
  </div>
{/if}
