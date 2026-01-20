<script lang="ts">
  import type { ShowViewModel } from "specloom";
  import type { Snippet } from "svelte";
  import { createShowContext } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    vm: ShowViewModel;
    onAction?: (actionId: string) => void;
    class?: string;
    children: Snippet;
  }

  let {
    vm,
    onAction,
    class: className,
    children,
  }: Props = $props();

  // Create context for child components
  // Wrap callbacks in closures to capture latest values (Svelte 5 reactivity)
  createShowContext({
    vm: () => vm,
    onAction: (actionId) => onAction?.(actionId),
  });
</script>

<Card.Root class={cn(className)}>
  {@render children()}
</Card.Root>
