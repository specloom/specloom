<script lang="ts">
  import type { Snippet } from "svelte";
  import type { FormFieldVM, FieldGroup } from "specloom";
  import { FormHelpers } from "specloom";
  import { getFormContext } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";
  import FormGroup from "./FormGroup.svelte";
  import FormField from "./FormField.svelte";

  interface Props {
    class?: string;
    children?: Snippet<[{ fields: FormFieldVM[]; groups: FieldGroup[] }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getFormContext();
</script>

<Card.Content class={cn(className)}>
  {#if children}
    {@render children({ fields: ctx.visibleFields, groups: ctx.groups })}
  {:else if ctx.groups.length > 0}
    <div class="space-y-8">
      {#each ctx.groups as group}
        <FormGroup {group} />
      {/each}
    </div>
  {:else}
    <div class="space-y-6">
      {#each ctx.visibleFields as field}
        <FormField {field} />
      {/each}
    </div>
  {/if}
</Card.Content>
