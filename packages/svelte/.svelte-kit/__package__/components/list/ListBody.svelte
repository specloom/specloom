<script lang="ts">
  import type { Snippet } from "svelte";
  import type { RowVM } from "specloom";
  import { getListContext } from "./context.svelte.js";
  import * as Table from "../ui/table/index.js";
  import { cn } from "../../utils.js";
  import { ja as labels } from "../../i18n/ja.js";
  import ListRow from "./ListRow.svelte";

  interface Props {
    class?: string;
    children?: Snippet<[{ rows: RowVM[] }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();
</script>

<Table.Body class={cn(className)}>
  {#if children}
    {@render children({ rows: ctx.rows })}
  {:else if ctx.empty}
    <Table.Row>
      <Table.Cell colspan={ctx.fields.length + (ctx.selectable ? 2 : 1)} class="h-24 text-center">
        <span class="text-sm text-muted-foreground">{labels.noData}</span>
      </Table.Cell>
    </Table.Row>
  {:else}
    {#each ctx.rows as row}
      <ListRow {row} />
    {/each}
  {/if}
</Table.Body>
