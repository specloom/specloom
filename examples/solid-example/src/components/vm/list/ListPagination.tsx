import { Show } from "solid-js";
import {
  Pagination,
  PaginationItems,
  PaginationItem,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";

interface ListPaginationProps {
  total?: number;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
}

export function ListPagination(props: ListPaginationProps) {
  return (
    <Show when={props.total && props.perPage && props.total > props.perPage}>
      <Pagination
        count={Math.ceil(props.total! / props.perPage!)}
        page={props.page ?? 1}
        onPageChange={(page) => props.onPageChange?.(page)}
        itemComponent={(itemProps) => <PaginationItem page={itemProps.page}>{itemProps.page}</PaginationItem>}
        ellipsisComponent={() => <PaginationEllipsis />}
      >
        <PaginationPrevious />
        <PaginationItems />
        <PaginationNext />
      </Pagination>
    </Show>
  );
}
