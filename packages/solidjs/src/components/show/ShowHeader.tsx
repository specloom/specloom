import {
  type Component,
  type JSX,
  Show,
  children as resolveChildren,
} from "solid-js";
import { useShow } from "./context.jsx";
import { ShowActions } from "./ShowActions.jsx";

export interface ShowHeaderProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ShowHeader - 詳細ビューのヘッダー部分
 */
export const ShowHeader: Component<ShowHeaderProps> = (props) => {
  const { label, onAction } = useShow();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <div
      class={
        props.class ??
        "flex items-center justify-between border-b border-border px-6 py-4"
      }
    >
      <Show
        when={hasChildren()}
        fallback={
          <>
            <div>
              <h2 class="text-lg font-semibold text-foreground">{label()}</h2>
            </div>
            <Show when={onAction}>
              <ShowActions />
            </Show>
          </>
        }
      >
        {resolved()}
      </Show>
    </div>
  );
};

export interface ShowTitleProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * ShowTitle - 詳細ビューのタイトル
 */
export const ShowTitle: Component<ShowTitleProps> = (props) => {
  const { label } = useShow();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <h2 class={props.class ?? "text-lg font-semibold text-foreground"}>
      <Show when={hasChildren()} fallback={label()}>
        {resolved()}
      </Show>
    </h2>
  );
};
