<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { cn } from "$lib/utils.js";
  import { getListContext } from "./context.svelte.js";
  import ListHeader from "./ListHeader.svelte";
  import ListBody from "./ListBody.svelte";

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();
</script>

<Table.Root class={cn(className)}>
  {#if children}
    {@render children()}
  {:else}
    <ListHeader />
    <ListBody />
  {/if}
</Table.Root>
