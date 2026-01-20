<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Table from "../ui/table/index.js";
  import { cn } from "../../utils.js";

  interface Props {
    class?: string;
    children: Snippet;
  }

  let { class: className, children }: Props = $props();
</script>

<Table.Root class={cn(className)}>
  {@render children()}
</Table.Root>
