<script lang="ts">
  import type { ListViewModel } from "specloom";
  import type { Snippet } from "svelte";
  import { createListContext } from "./context.svelte.js";
  import * as Card from "../ui/card/index.js";
  import { cn } from "../../utils.js";

  interface Props {
    vm: ListViewModel;
    onSort?: (field: string) => void;
    onSelect?: (rowId: string) => void;
    onSelectAll?: () => void;
    onAction?: (actionId: string, rowIds?: string[]) => void;
    onPageChange?: (page: number) => void;
    onRowClick?: (rowId: string) => void;
    class?: string;
    children: Snippet;
  }

  let {
    vm,
    onSort,
    onSelect,
    onSelectAll,
    onAction,
    onPageChange,
    onRowClick,
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
  });
</script>

<Card.Root class={cn(className)}>
  {@render children()}
</Card.Root>
