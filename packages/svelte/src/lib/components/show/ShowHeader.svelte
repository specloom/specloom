<script lang="ts">
  import type { Snippet } from "svelte";
  import { getShowContext } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ label: string; id: string }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getShowContext();
</script>

<Card.Header class={cn("flex flex-row items-center justify-between", className)}>
  {#if children}
    {@render children({ label: ctx.label, id: ctx.id })}
  {:else}
    <Card.Title>{ctx.label}</Card.Title>
  {/if}
</Card.Header>
