<script lang="ts">
  import type { Snippet } from "svelte";
  import { getFormContext } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ label: string; mode: "create" | "edit" }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getFormContext();
</script>

<Card.Header class={cn("flex flex-row items-center justify-between", className)}>
  {#if children}
    {@render children({ label: ctx.label, mode: ctx.mode })}
  {:else}
    <Card.Title>{ctx.label}</Card.Title>
  {/if}
</Card.Header>
