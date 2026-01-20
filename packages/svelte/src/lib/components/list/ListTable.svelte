<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
</script>

<Table.Root class={cn(className)}>
  {#if children}
    {@render children()}
  {/if}
</Table.Root>
