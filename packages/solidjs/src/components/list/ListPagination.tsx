import {
  type Component,
  type JSX,
  For,
  Show,
  children as resolveChildren,
} from "solid-js";
import { Pagination } from "@ark-ui/solid/pagination";
import { useList } from "./context.jsx";
import { buttonClasses } from "../ui/index.js";

export interface ListPaginationProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ListPagination - ページネーション
 *
 * @example
 * // デフォルト構成
 * <ListPagination />
 *
 * @example
 * // カスタマイズ
 * <ListPagination>
 *   <ListPaginationInfo />
 *   <ListPaginationNav />
 * </ListPagination>
 */
export const ListPagination: Component<ListPaginationProps> = (props) => {
  const { totalPages, loading } = useList();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <Show when={!loading() && totalPages() > 1}>
      <div
        class={
          props.class ??
          "flex items-center justify-between border-t border-border px-4 py-3"
        }
      >
        <Show when={hasChildren()} fallback={<DefaultPaginationContent />}>
          {resolved()}
        </Show>
      </div>
    </Show>
  );
};

function DefaultPaginationContent() {
  return (
    <>
      <ListPaginationInfo />
      <ListPaginationNav />
    </>
  );
}

export interface ListPaginationInfoProps {
  class?: string;
}

/**
 * ListPaginationInfo - ページ情報表示
 */
export const ListPaginationInfo: Component<ListPaginationInfoProps> = (
  props,
) => {
  const { page, totalPages, total } = useList();

  return (
    <p class={props.class ?? "text-sm text-muted-foreground"}>
      全 <span class="font-medium text-foreground">{total()}</span> 件中{" "}
      <span class="font-medium text-foreground">{page()}</span> /{" "}
      <span class="font-medium text-foreground">{totalPages()}</span> ページ
    </p>
  );
};

export interface ListPaginationNavProps {
  class?: string;
  pageSize?: number;
  siblingCount?: number;
}

/**
 * ListPaginationNav - ページナビゲーション
 */
export const ListPaginationNav: Component<ListPaginationNavProps> = (props) => {
  const { page, total, onPageChange } = useList();

  return (
    <Pagination.Root
      count={total()}
      pageSize={props.pageSize ?? 10}
      page={page()}
      onPageChange={(e) => onPageChange?.(e.page)}
      siblingCount={props.siblingCount ?? 1}
    >
      <nav class={props.class ?? "flex items-center gap-1"}>
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
              {(pageItem, index) =>
                pageItem.type === "page" ? (
                  <Pagination.Item
                    {...pageItem}
                    class={buttonClasses({
                      variant: "outline",
                      size: "icon",
                      class:
                        "h-8 w-8 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:border-primary data-[selected]:hover:bg-primary/90",
                    })}
                  >
                    {pageItem.value}
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
  );
};
