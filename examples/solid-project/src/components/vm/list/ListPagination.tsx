import { useI18n } from "@specloom/solidjs";
import { Show } from "solid-js";
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
  onPageChange: (page: number) => void;
}) {
  const { t } = useI18n();
  const pageCount = () => Math.max(1, Math.ceil(props.total / props.perPage));
  const rangeStart = () =>
    props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1;
  const rangeEnd = () => Math.min(props.page * props.perPage, props.total);

  return (
    <Show when={pageCount() > 1}>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-muted-foreground">
          {t("list.pagination.summary", {
            from: rangeStart(),
            to: rangeEnd(),
            total: props.total,
          })}
        </p>
        <Pagination
          page={props.page}
          count={pageCount()}
          onPageChange={props.onPageChange}
          siblingCount={1}
          showFirst
          showLast
          fixedItems
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
    </Show>
  );
}
