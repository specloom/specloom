<script lang="ts">
  import type { Snippet } from "svelte";
  import { getFormContext } from "./context.svelte.js";
  import * as Alert from "../ui/alert/index.js";
  import { cn } from "../../utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ error: string }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getFormContext();
</script>

{#if ctx.error}
  <div class={cn("mx-6 mt-4", className)}>
    {#if children}
      {@render children({ error: ctx.error })}
    {:else}
      <Alert.Root variant="destructive">
        <Alert.Title>エラー</Alert.Title>
        <Alert.Description>{ctx.error}</Alert.Description>
      </Alert.Root>
    {/if}
  </div>
{/if}
