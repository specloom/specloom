import {
  type Component,
  type JSX,
  For,
  Show,
  children as resolveChildren,
} from "solid-js";
import { ActionVMHelper } from "specloom";
import { useList } from "./context.jsx";
import { ActionButton } from "../shared/ActionButton.jsx";

export interface ListToolbarProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ListToolbar - ヘッダーアクションとバルクアクションを表示
 *
 * @example
 * // デフォルト構成
 * <ListToolbar />
 *
 * @example
 * // カスタマイズ
 * <ListToolbar>
 *   <ListHeaderActions />
 *   <MyCustomSearch />
 * </ListToolbar>
 */
export const ListToolbar: Component<ListToolbarProps> = (props) => {
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <Show
      when={hasChildren()}
      fallback={<DefaultToolbarContent class={props.class} />}
    >
      <div class={props.class}>{resolved()}</div>
    </Show>
  );
};

function DefaultToolbarContent(props: { class?: string }) {
  return (
    <>
      <ListHeaderActions class={props.class} />
      <ListBulkActions />
    </>
  );
}

export interface ListHeaderActionsProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ListHeaderActions - ページアクションボタン
 */
export const ListHeaderActions: Component<ListHeaderActionsProps> = (props) => {
  const { pageActions, onAction } = useList();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  const allowedActions = () => ActionVMHelper.allowed(pageActions());

  return (
    <Show when={allowedActions().length > 0}>
      <div
        class={
          props.class ??
          "flex items-center justify-between border-b border-border p-4"
        }
      >
        <Show
          when={hasChildren()}
          fallback={
            <div class="flex items-center gap-2">
              <For each={allowedActions()}>
                {(action) => (
                  <ActionButton
                    action={action}
                    onExecute={(id) => onAction?.(id)}
                  />
                )}
              </For>
            </div>
          }
        >
          {resolved()}
        </Show>
      </div>
    </Show>
  );
};

export interface ListBulkActionsProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ListBulkActions - 選択時のバルクアクションバー
 */
export const ListBulkActions: Component<ListBulkActionsProps> = (props) => {
  const { bulkActions, selectedCount, selectedIds, onAction } = useList();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  const allowedActions = () => ActionVMHelper.allowed(bulkActions());

  return (
    <Show when={selectedCount() > 0}>
      <div
        class={
          props.class ??
          "flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3"
        }
      >
        <span class="text-sm font-medium text-foreground">
          {selectedCount()} 件選択中
        </span>
        <Show
          when={hasChildren()}
          fallback={
            <div class="flex items-center gap-2">
              <For each={allowedActions()}>
                {(action) => (
                  <ActionButton
                    action={action}
                    onExecute={(id) => onAction?.(id, selectedIds())}
                    size="sm"
                  />
                )}
              </For>
            </div>
          }
        >
          {resolved()}
        </Show>
      </div>
    </Show>
  );
};
