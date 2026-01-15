import { ark } from "@ark-ui/solid/factory";
import { styled } from "styled-system/jsx";
import { table } from "styled-system/recipes";
import type { ComponentProps } from "styled-system/types";

const tableStyles = table();

export type TableProps = ComponentProps<typeof Table>;
export const Table = styled(ark.table, { base: tableStyles.root });

export type TableHeadProps = ComponentProps<typeof TableHead>;
export const TableHead = styled(ark.thead, { base: tableStyles.head });

export type TableBodyProps = ComponentProps<typeof TableBody>;
export const TableBody = styled(ark.tbody, { base: tableStyles.body });

export type TableRowProps = ComponentProps<typeof TableRow>;
export const TableRow = styled(ark.tr, { base: tableStyles.row });

export type TableHeaderProps = ComponentProps<typeof TableHeader>;
export const TableHeader = styled(ark.th, { base: tableStyles.header });

export type TableCellProps = ComponentProps<typeof TableCell>;
export const TableCell = styled(ark.td, { base: tableStyles.cell });
