<script lang="ts">
  import type { Snippet } from "svelte";
  import type { FieldGroup, FormFieldVM } from "specloom";
  import { FormHelpers } from "specloom";
  import { getFormContext } from "./context.svelte.js";
  import { cn } from "../../utils.js";
  import FormField from "./FormField.svelte";

  interface Props {
    group: FieldGroup;
    class?: string;
    children?: Snippet<[{ group: FieldGroup; fields: FormFieldVM[] }]>;
  }

  let { group, class: className, children }: Props = $props();
  const ctx = getFormContext();

  const groupFields = $derived(FormHelpers.fieldsInGroup(ctx.vm, group.id));
</script>

{#if children}
  {@render children({ group, fields: groupFields })}
{:else}
  <fieldset class={cn("rounded-lg border p-6", className)}>
    <legend class="px-2 text-sm font-semibold">{group.label}</legend>
    <div class="space-y-6">
      {#each groupFields as field}
        <FormField {field} />
      {/each}
    </div>
  </fieldset>
{/if}
