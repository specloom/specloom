<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ListFieldVM } from "specloom";
  import { ListHelpers } from "specloom";
  import { getListContext } from "./context.svelte.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { cn } from "$lib/utils.js";
  import { ja as labels } from "$lib/i18n/ja.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ fields: ListFieldVM[] }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();

  function handleSort(field: ListFieldVM) {
    if (field.sortable && ctx.onSort) {
      ctx.onSort(field.name);
    }
  }
</script>

<Table.Header class={cn(className)}>
  {#if children}
    {@render children({ fields: ctx.fields })}
  {:else}
    <Table.Row>
      {#if ctx.selectable && ctx.multiSelect}
        <Table.Head class="w-12">
          <Checkbox
            checked={ctx.allSelected}
            onCheckedChange={() => ctx.onSelectAll?.()}
          />
        </Table.Head>
      {:else if ctx.selectable}
        <Table.Head class="w-12"></Table.Head>
      {/if}
      {#each ctx.fields as field}
        <Table.Head
          class={cn(field.sortable && "cursor-pointer hover:text-foreground")}
          onclick={() => handleSort(field)}
        >
          <div class="flex items-center gap-1">
            <span>{field.label}</span>
            {#if field.sortable}
              <span class="text-xs">{ListHelpers.sortIcon(ctx.vm, field.name)}</span>
            {/if}
          </div>
        </Table.Head>
      {/each}
      <Table.Head class="w-20 text-right">{labels.actions}</Table.Head>
    </Table.Row>
  {/if}
</Table.Header>
