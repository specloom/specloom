import { type Component, For, Show } from "solid-js";
import { Pagination } from "@ark-ui/solid/pagination";
import { buttonClasses } from "../ui/index.js";

export interface ListPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize?: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange?: (page: number) => void;
}

export const ListPagination: Component<ListPaginationProps> = (props) => {
  return (
    <Show when={props.totalPages > 1}>
      <div class="flex items-center justify-between border-t border-border px-4 py-3">
        <p class="text-sm text-muted-foreground">
          全 <span class="font-medium text-foreground">{props.total}</span> 件中{" "}
          <span class="font-medium text-foreground">{props.page}</span> /{" "}
          <span class="font-medium text-foreground">{props.totalPages}</span>{" "}
          ページ
        </p>

        <Pagination.Root
          count={props.total}
          pageSize={props.pageSize ?? 10}
          page={props.page}
          onPageChange={(e) => props.onPageChange?.(e.page)}
          siblingCount={1}
        >
          <nav class="flex items-center gap-1">
            <Pagination.PrevTrigger
              class={buttonClasses({
                variant: "outline",
                size: "sm",
                class: "gap-1 text-sm",
              })}
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span class="hidden sm:inline">前へ</span>
            </Pagination.PrevTrigger>

            <Pagination.Context>
              {(api) => (
                <For each={api().pages}>
                  {(page, index) =>
                    page.type === "page" ? (
                      <Pagination.Item
                        {...page}
                        class={buttonClasses({
                          variant: "outline",
                          size: "icon",
                          class:
                            "h-8 w-8 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:border-primary data-[selected]:hover:bg-primary/90",
                        })}
                      >
                        {page.value}
                      </Pagination.Item>
                    ) : (
                      <Pagination.Ellipsis
                        index={index()}
                        class="flex h-8 w-8 items-center justify-center text-muted-foreground"
                      >
                        <svg
                          class="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </Pagination.Ellipsis>
                    )
                  }
                </For>
              )}
            </Pagination.Context>

            <Pagination.NextTrigger
              class={buttonClasses({
                variant: "outline",
                size: "sm",
                class: "gap-1 text-sm",
              })}
            >
              <span class="hidden sm:inline">次へ</span>
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Pagination.NextTrigger>
          </nav>
        </Pagination.Root>
      </div>
    </Show>
  );
};
