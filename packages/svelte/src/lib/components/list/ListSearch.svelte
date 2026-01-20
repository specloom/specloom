<script lang="ts">
  import type { Snippet } from "svelte";
  import SearchIcon from "@lucide/svelte/icons/search";
  import XIcon from "@lucide/svelte/icons/x";
  import { getListContext } from "./context.svelte.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    placeholder?: string;
    class?: string;
    children?: Snippet<[{ query: string; searchFields: string[] }]>;
  }

  let { placeholder = "検索...", class: className, children }: Props = $props();
  const ctx = getListContext();

  let inputValue = $state(ctx.searchQuery);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    inputValue = target.value;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      ctx.onSearch?.(inputValue);
    }
  }

  function handleClear() {
    inputValue = "";
    ctx.onSearch?.("");
  }

  function handleSearch() {
    ctx.onSearch?.(inputValue);
  }
</script>

{#if ctx.searchable}
  <div class={cn("relative flex items-center gap-2", className)}>
    {#if children}
      {@render children({ query: ctx.searchQuery, searchFields: ctx.searchFields })}
    {:else}
      <div class="relative flex-1">
        <SearchIcon class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          oninput={handleInput}
          onkeydown={handleKeydown}
          {placeholder}
          class="pl-9 pr-8"
        />
        {#if inputValue}
          <Button
            variant="ghost"
            size="icon"
            class="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onclick={handleClear}
          >
            <XIcon class="h-3 w-3" />
            <span class="sr-only">クリア</span>
          </Button>
        {/if}
      </div>
      <Button variant="secondary" size="sm" onclick={handleSearch}>
        検索
      </Button>
    {/if}
  </div>
{/if}
