<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ShowFieldVM } from "specloom";
  import { ShowHelpers } from "specloom";
  import { getShowContext } from "./context.svelte.js";
  import { cn } from "../../utils.js";
  import { ja as labels } from "../../i18n/ja.js";

  interface Props {
    field: ShowFieldVM;
    class?: string;
    children?: Snippet<[{ field: ShowFieldVM; value: unknown; formatted: string }]>;
  }

  let { field, class: className, children }: Props = $props();
  const ctx = getShowContext();

  const value = $derived(ShowHelpers.value(ctx.vm, field.name));

  function formatValue(field: ShowFieldVM, val: unknown): string {
    if (val == null) return labels.empty;

    if (field.kind === "boolean") {
      return val ? labels.yes : labels.no;
    }

    if (field.kind === "enum" || field.kind === "status") {
      const opt = field.options?.find((o) => o.value === String(val));
      return opt?.label ?? String(val);
    }

    if (field.kind === "date" && val) {
      return new Date(String(val)).toLocaleDateString("ja-JP");
    }

    if (field.kind === "datetime" && val) {
      return new Date(String(val)).toLocaleString("ja-JP");
    }

    return String(val);
  }

  const formatted = $derived(formatValue(field, value));
</script>

{#if children}
  {@render children({ field, value, formatted })}
{:else}
  <div class={cn("flex flex-col gap-1", className)}>
    <dt class="text-sm font-medium text-muted-foreground">{field.label}</dt>
    <dd class="text-base">{formatted}</dd>
  </div>
{/if}
