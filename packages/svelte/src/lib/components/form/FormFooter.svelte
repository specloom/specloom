<script lang="ts">
  import type { Snippet } from "svelte";
  import { getFormContext } from "./context.svelte.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ canSubmit: boolean; submitting: boolean }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getFormContext();
</script>

<Card.Footer class={cn("flex items-center justify-end gap-3 border-t bg-muted/40", className)}>
  {#if children}
    {@render children({ canSubmit: ctx.canSubmit, submitting: ctx.submitting })}
  {:else}
    <Button type="submit" disabled={!ctx.canSubmit}>
      {#if ctx.submitting}
        保存中...
      {:else}
        保存
      {/if}
    </Button>
  {/if}
</Card.Footer>
