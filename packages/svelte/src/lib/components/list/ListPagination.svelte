<script lang="ts">
  import type { Snippet } from "svelte";
  import { Pagination as PaginationPrimitive } from "bits-ui";
  import { getListContext } from "./context.svelte.js";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import { cn } from "$lib/utils.js";

  interface Props {
    class?: string;
    children?: Snippet<[{ page: number; totalPages: number; hasNext: boolean; hasPrev: boolean }]>;
  }

  let { class: className, children }: Props = $props();
  const ctx = getListContext();

  const pageSize = $derived(ctx.vm.pagination?.pageSize ?? 10);

  function handlePageChange(newPage: number) {
    ctx.onPageChange?.(newPage);
  }
</script>

{#if ctx.totalPages > 1}
  <div class={cn("flex items-center justify-center border-t p-4", className)}>
    {#if children}
      {@render children({ page: ctx.page, totalPages: ctx.totalPages, hasNext: ctx.hasNext, hasPrev: ctx.hasPrev })}
    {:else}
      <Pagination.Root
        count={ctx.total}
        perPage={pageSize}
        page={ctx.page}
        onPageChange={handlePageChange}
      >
        {#snippet children({ pages })}
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.PrevButton />
            </Pagination.Item>
            {#each pages as page (page.key)}
              {#if page.type === "ellipsis"}
                <Pagination.Item>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              {:else}
                <Pagination.Item>
                  <Pagination.Link {page} isActive={ctx.page === page.value} />
                </Pagination.Item>
              {/if}
            {/each}
            <Pagination.Item>
              <Pagination.NextButton />
            </Pagination.Item>
          </Pagination.Content>
        {/snippet}
      </Pagination.Root>
    {/if}
  </div>
{/if}
