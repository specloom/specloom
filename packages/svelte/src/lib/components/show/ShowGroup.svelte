<script lang="ts">
  import type { Snippet } from "svelte";
  import type { FieldGroup, ShowFieldVM } from "specloom";
  import { ShowVM } from "specloom";
  import { getShowContext } from "./context.svelte.js";
  import { cn } from "$lib/utils.js";
  import ShowField from "./ShowField.svelte";

  interface Props {
    group: FieldGroup;
    class?: string;
    children?: Snippet<[{ group: FieldGroup; fields: ShowFieldVM[] }]>;
  }

  let { group, class: className, children }: Props = $props();
  const ctx = getShowContext();
  const getVM = () => new ShowVM(ctx.vm);

  const groupFields = $derived(getVM().fieldsInGroup(group.id));
</script>

{#if children}
  {@render children({ group, fields: groupFields })}
{:else}
  <div class={cn("rounded-lg border p-4", className)}>
    <h3 class="mb-4 text-lg font-semibold">{group.label}</h3>
    <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
      {#each groupFields as field}
        <ShowField {field} />
      {/each}
    </dl>
  </div>
{/if}
