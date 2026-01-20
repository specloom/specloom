<script lang="ts">
  import type { ListViewModel } from "specloom";
  import type { Snippet } from "svelte";
  import { createListContext } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";
  import ListToolbar from "./ListToolbar.svelte";
  import ListTable from "./ListTable.svelte";
  import ListPagination from "./ListPagination.svelte";
  import ListLoading from "./ListLoading.svelte";
  import ListError from "./ListError.svelte";
  import ListEmpty from "./ListEmpty.svelte";

  interface Props {
    vm: ListViewModel;
    onSort?: (field: string) => void;
    onSelect?: (rowId: string) => void;
    onSelectAll?: () => void;
    onAction?: (actionId: string, rowIds?: string[]) => void;
    onPageChange?: (page: number) => void;
    onRowClick?: (rowId: string) => void;
    onSearch?: (query: string) => void;
    onFilterToggle?: (filterId: string) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    vm,
    onSort,
    onSelect,
    onSelectAll,
    onAction,
    onPageChange,
    onRowClick,
    onSearch,
    onFilterToggle,
    class: className,
    children,
  }: Props = $props();

  // Create context for child components
  // Wrap callbacks in closures to capture latest values (Svelte 5 reactivity)
  createListContext({
    vm: () => vm,
    onSort: (field) => onSort?.(field),
    onSelect: (rowId) => onSelect?.(rowId),
    onSelectAll: () => onSelectAll?.(),
    onAction: (actionId, rowIds) => onAction?.(actionId, rowIds),
    onPageChange: (page) => onPageChange?.(page),
    onRowClick: (rowId) => onRowClick?.(rowId),
    onSearch: (query) => onSearch?.(query),
    onFilterToggle: (filterId) => onFilterToggle?.(filterId),
  });
</script>

<Card.Root class={cn(className)}>
  {#if children}
    {@render children()}
  {:else}
    <ListToolbar />
    {#if vm.isLoading}
      <ListLoading />
    {:else if vm.error}
      <ListError />
    {:else if vm.rows.length === 0}
      <ListEmpty />
    {:else}
      <ListTable />
      {#if vm.pagination}
        <ListPagination />
      {/if}
    {/if}
  {/if}
</Card.Root>
