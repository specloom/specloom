import { For, Show } from "solid-js";
import type { Accessor } from "solid-js";
import { A } from "@solidjs/router";
import type { ListVM, ActionVM, ListFieldVM, RowVM } from "specloom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { statusVariant } from "./utils";

interface ListTableProps {
  vm: Accessor<ListVM>;
  rows: Accessor<RowVM[]>;
  basePath: string;
  visibleFields: Accessor<ListFieldVM[]>;
  selectedIds: Accessor<Set<string>>;
  onSort: (field: ListFieldVM) => void;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  isAllSelected: Accessor<boolean>;
  isIndeterminate: Accessor<boolean>;
  onAction: (actionId: string, rowId?: string) => void;
}

export function ListTable(props: ListTableProps) {
  const isSelected = (id: string) => props.selectedIds().has(id);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* Selection checkbox header */}
          <Show when={props.vm().isSelectable}>
            <TableHead class="w-10">
              <Show when={props.vm().isMultiSelect}>
                <Checkbox
                  checked={props.isAllSelected()}
                  indeterminate={props.isIndeterminate()}
                  onChange={props.onToggleAll}
                />
              </Show>
            </TableHead>
          </Show>

          {/* Column headers with sort */}
          <For each={props.visibleFields()}>
            {(field: ListFieldVM) => (
              <TableHead
                class={field.sortable ? "cursor-pointer select-none" : undefined}
                onClick={() => props.onSort(field)}
              >
                <div class="flex items-center gap-1">
                  {field.label}
                  <Show when={field.sortable}>
                    <span class="text-xs text-muted-foreground">
                      {props.vm().isSorted(field.name)
                        ? props.vm().sortIcon(field.name)
                        : "⇅"}
                    </span>
                  </Show>
                </div>
              </TableHead>
            )}
          </For>
          <TableHead class="w-25" />
        </TableRow>
      </TableHeader>
      <TableBody>
        <For each={props.rows()}>
          {(row: RowVM) => (
            <TableRow
              class={
                [
                  props.vm().clickAction ? "cursor-pointer" : "",
                  isSelected(row.id) ? "bg-muted/50" : "",
                ].filter(Boolean).join(" ") || undefined
              }
            >
              {/* Selection checkbox */}
              <Show when={props.vm().isSelectable}>
                <TableCell>
                  <Checkbox
                    checked={isSelected(row.id)}
                    onChange={() => props.onToggleSelect(row.id)}
                  />
                </TableCell>
              </Show>

              {/* Data cells */}
              <For each={props.visibleFields()}>
                {(field: ListFieldVM) => {
                  const value = props.vm().cellValue(row, field.name);
                  const formatted = props.vm().formatCell(field, value);
                  return (
                    <TableCell>
                      <Show
                        when={props.vm().clickAction && field === props.visibleFields()[0]}
                        fallback={
                          <Show
                            when={field.kind === "status" || field.kind === "enum"}
                            fallback={<span>{formatted}</span>}
                          >
                            <Badge variant={statusVariant(value)}>{formatted}</Badge>
                          </Show>
                        }
                      >
                        <A href={`${props.basePath}/${row.id}`} class="font-medium hover:underline">
                          {formatted}
                        </A>
                      </Show>
                    </TableCell>
                  );
                }}
              </For>

              {/* Row actions */}
              <TableCell>
                <div class="flex justify-end gap-1">
                  <For each={row.actions.filter((a: ActionVM) => a.allowed)}>
                    {(action: ActionVM) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          props.onAction(action.id, row.id);
                        }}
                      >
                        {action.label}
                      </Button>
                    )}
                  </For>
                </div>
              </TableCell>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  );
}
