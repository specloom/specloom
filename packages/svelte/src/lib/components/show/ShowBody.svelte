<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ShowFieldVM, FieldGroup } from "specloom";
  import { getShowContext } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";
  import ShowGroup from "./ShowGroup.svelte";
  import ShowField from "./ShowField.svelte";

  interface Props {
    class?: string;
    children?: Snippet<[{ fields: ShowFieldVM[]; groups: FieldGroup[] }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getShowContext();
</script>

<Card.Content class={cn(className)}>
  {#if children}
    {@render children({ fields: ctx.fields, groups: ctx.groups })}
  {:else if ctx.groups.length > 0}
    <div class="space-y-8">
      {#each ctx.groups as group}
        <ShowGroup {group} />
      {/each}
    </div>
  {:else}
    <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {#each ctx.fields as field}
        <ShowField {field} />
      {/each}
    </dl>
  {/if}
</Card.Content>
