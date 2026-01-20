<script lang="ts">
  import type { Snippet } from "svelte";
  import { getFormContext } from "./context.svelte.js";
  import { Spinner } from "../ui/spinner/index.js";
  import { cn } from "../../utils.js";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
  const ctx = getFormContext();
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
