<script lang="ts">
  import type { Snippet } from "svelte";
  import { getListContext } from "./context.svelte.js";
  import * as Empty from "$lib/components/ui/empty/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();
</script>

{#if ctx.empty && !ctx.loading}
  <div class={cn("flex items-center justify-center py-12", className)}>
    {#if children}
      {@render children()}
    {:else}
      <Empty.Root>
        <Empty.Title>データがありません</Empty.Title>
        <Empty.Description>該当するデータが見つかりませんでした</Empty.Description>
      </Empty.Root>
    {/if}
  </div>
{/if}
