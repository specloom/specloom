<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ShowFieldVM } from "specloom";
  import { ShowVM } from "specloom";
  import { getShowContext } from "./context.svelte.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    field: ShowFieldVM;
    class?: string;
    children?: Snippet<[{ field: ShowFieldVM; value: unknown; formatted: string }]>;
  }

  let { field, class: className, children }: Props = $props();
  const ctx = getShowContext();
  const getVM = () => new ShowVM(ctx.vm);

  const value = $derived(getVM().value(field.name));
  const formatted = $derived(getVM().formatValue(field, value));
</script>

{#if children}
  {@render children({ field, value, formatted })}
{:else}
  <div class={cn("flex flex-col gap-1", className)}>
    <dt class="text-sm font-medium text-muted-foreground">{field.label}</dt>
    <dd class="text-base">{formatted}</dd>
  </div>
{/if}
