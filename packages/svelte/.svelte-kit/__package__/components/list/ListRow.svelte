<script lang="ts">
  import type { Snippet } from "svelte";
  import type { RowVM, ActionVM } from "specloom";
  import { ActionHelpers } from "specloom";
  import { getListContext } from "./context.svelte.js";
  import * as Table from "../ui/table/index.js";
  import { Checkbox } from "../ui/checkbox/index.js";
  import { Button } from "../ui/button/index.js";
  import { cn } from "../../utils.js";

  interface Props {
    row: RowVM;
    class?: string;
    children?: Snippet<[{ row: RowVM; selected: boolean; actions: ActionVM[] }]>;
  }

  let { row, class: className, children }: Props = $props();
  const ctx = getListContext();

  const selected = $derived(ctx.vm.selection.selected.includes(row.id));
  const rowActions = $derived(ActionHelpers.allowed(row.actions));

  function handleRowClick() {
    if (ctx.vm.clickAction && ctx.onRowClick) {
      ctx.onRowClick(row.id);
    }
  }
</script>

{#if children}
  {@render children({ row, selected, actions: rowActions })}
{:else}
  <Table.Row
    class={cn(
      selected && "bg-muted",
      ctx.vm.clickAction && "cursor-pointer",
      className
    )}
    onclick={handleRowClick}
  >
    {#if ctx.selectable}
      <Table.Cell class="w-12" onclick={(e) => e.stopPropagation()}>
        {#if ctx.multiSelect}
          <Checkbox
            checked={selected}
            onCheckedChange={() => ctx.onSelect?.(row.id)}
          />
        {:else}
          <input
            type="radio"
            checked={selected}
            onchange={() => ctx.onSelect?.(row.id)}
            class="h-4 w-4"
          />
        {/if}
      </Table.Cell>
    {/if}
    {#each ctx.fields as field}
      <Table.Cell>
        {row.values[field.name] ?? ""}
      </Table.Cell>
    {/each}
    <Table.Cell class="w-20 text-right" onclick={(e) => e.stopPropagation()}>
      <div class="flex items-center justify-end gap-1">
        {#each rowActions as action}
          <Button
            variant="ghost"
            size="sm"
            onclick={() => ctx.onAction?.(action.id, [row.id])}
          >
            {action.label}
          </Button>
        {/each}
      </div>
    </Table.Cell>
  </Table.Row>
{/if}
