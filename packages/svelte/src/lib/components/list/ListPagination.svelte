<script lang="ts">
  import type { Snippet } from "svelte";
  import { getListContext } from "./context.svelte.js";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ page: number; totalPages: number; hasNext: boolean; hasPrev: boolean }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();

  const perPage = $derived(ctx.totalPages > 0 ? Math.ceil(ctx.total / ctx.totalPages) : 10);
</script>

{#if ctx.totalPages > 1}
  <div class={cn("flex items-center justify-center border-t p-4", className)}>
    {#if children}
      {@render children({ page: ctx.page, totalPages: ctx.totalPages, hasNext: ctx.hasNext, hasPrev: ctx.hasPrev })}
    {:else}
      <Pagination.Root
        count={ctx.total}
        perPage={perPage}
        page={ctx.page}
        onPageChange={(page) => ctx.onPageChange?.(page)}
      >
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.PrevButton />
          </Pagination.Item>
          {#each { length: ctx.totalPages } as _, i}
            <Pagination.Item>
              <Pagination.Link page={i + 1} isActive={ctx.page === i + 1}>
                {i + 1}
              </Pagination.Link>
            </Pagination.Item>
          {/each}
          <Pagination.Item>
            <Pagination.NextButton />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination.Root>
    {/if}
  </div>
{/if}
