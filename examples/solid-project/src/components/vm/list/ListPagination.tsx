import { useI18n } from "@specloom/solidjs";
import { For, Show } from "solid-js";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

export function ListPagination(props: {
  page: number;
  perPage: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}) {
  const { t } = useI18n();
  const pageCount = () => Math.max(1, Math.ceil(props.total / props.perPage));
  const rangeStart = () =>
    props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1;
  const rangeEnd = () => Math.min(props.page * props.perPage, props.total);
  const showPageSizeOptions = () => props.pageSizeOptions.length > 1;

  return (
    <Show when={pageCount() > 1 || showPageSizeOptions()}>
      <div class="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div class="flex min-h-10 flex-wrap items-center gap-x-4 gap-y-2">
          <p class="text-sm text-muted-foreground">
            {t("list.pagination.summary", {
              from: rangeStart(),
              to: rangeEnd(),
              total: props.total,
            })}
          </p>
          <Show when={showPageSizeOptions()}>
            <label class="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t("list.pagination.pageSize")}</span>
              <select
                class="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                value={String(props.perPage)}
                onChange={(e) =>
                  props.onPerPageChange(Number(e.currentTarget.value))
                }
              >
                <For each={props.pageSizeOptions}>
                  {(size) => <option value={String(size)}>{size}</option>}
                </For>
              </select>
            </label>
          </Show>
        </div>
        <div class="flex min-h-10 items-center justify-start md:justify-end">
          <Pagination
            page={props.page}
            count={pageCount()}
            onPageChange={props.onPageChange}
            siblingCount={1}
            showFirst
            showLast
            fixedItems
            classList={{
              "invisible pointer-events-none": pageCount() <= 1,
            }}
            itemComponent={(itemProps) => (
              <PaginationItem page={itemProps.page}>
                {itemProps.page}
              </PaginationItem>
            )}
            ellipsisComponent={() => <PaginationEllipsis />}
          >
            <PaginationPrevious>
              {t("list.pagination.previous")}
            </PaginationPrevious>
            <PaginationItems />
            <PaginationNext>{t("list.pagination.next")}</PaginationNext>
          </Pagination>
        </div>
      </div>
    </Show>
  );
}
