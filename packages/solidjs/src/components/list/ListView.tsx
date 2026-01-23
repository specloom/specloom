import {
  type Component,
  type JSX,
  children as resolveChildren,
  Show,
} from "solid-js";
import type { ListViewModel } from "specloom";
import { ListProvider } from "./context.jsx";
import { ListToolbar } from "./ListToolbar.jsx";
import { ListTable } from "./ListTable.jsx";
import { ListPagination } from "./ListPagination.jsx";
import { ListLoading } from "./ListLoading.jsx";
import { ListError } from "./ListError.jsx";
import { cardClasses } from "../ui/index.js";

export interface ListViewProps {
  vm: ListViewModel;
  onSort?: (field: string) => void;
  onSelect?: (rowId: string) => void;
  onSelectAll?: () => void;
  onAction?: (actionId: string, rowIds?: string[]) => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (rowId: string) => void;
  class?: string;
  children?: JSX.Element;
}

/**
 * ListView - Headless + 組み立て式のリストビュー
 *
 * @example
 * // シンプルに使う（デフォルト構成）
 * <ListView vm={vm} onAction={handleAction} />
 *
 * @example
 * // カスタマイズする
 * <ListView vm={vm} onAction={handleAction}>
 *   <ListToolbar>
 *     <ListHeaderActions />
 *   </ListToolbar>
 *   <ListTable />
 *   <ListPagination />
 * </ListView>
 */
export const ListView: Component<ListViewProps> = (props) => {
  const resolved = resolveChildren(() => props.children);

  // children が指定されていない場合はデフォルト構成を使用
  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <ListProvider
      vm={props.vm}
      onSort={props.onSort}
      onSelect={props.onSelect}
      onSelectAll={props.onSelectAll}
      onAction={props.onAction}
      onPageChange={props.onPageChange}
      onRowClick={props.onRowClick}
    >
      <div class={cardClasses(props.class)}>
        <Show when={hasChildren()} fallback={<DefaultListContent />}>
          {resolved()}
        </Show>
      </div>
    </ListProvider>
  );
};

/**
 * デフォルトのリスト構成
 */
function DefaultListContent() {
  return (
    <>
      <ListToolbar />
      <ListLoading />
      <ListError />
      <ListTable />
      <ListPagination />
    </>
  );
}
