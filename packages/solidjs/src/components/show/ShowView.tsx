import {
  type Component,
  type JSX,
  children as resolveChildren,
  Show,
} from "solid-js";
import type { ShowViewModel } from "specloom";
import { ShowProvider } from "./context.jsx";
import { ShowHeader } from "./ShowHeader.jsx";
import { ShowBody } from "./ShowBody.jsx";
import { ShowLoading } from "./ShowLoading.jsx";
import { ShowError } from "./ShowError.jsx";
import { cardClasses } from "../ui/index.js";

export interface ShowViewProps {
  vm: ShowViewModel;
  onAction?: (actionId: string) => void;
  class?: string;
  children?: JSX.Element;
}

/**
 * ShowView - Headless + 組み立て式の詳細ビュー
 *
 * @example
 * // シンプルに使う（デフォルト構成）
 * <ShowView vm={vm} onAction={handleAction} />
 *
 * @example
 * // カスタマイズする
 * <ShowView vm={vm} onAction={handleAction}>
 *   <ShowHeader />
 *   <ShowBody>
 *     {(field, value) => <MyCustomField field={field} value={value} />}
 *   </ShowBody>
 * </ShowView>
 */
export const ShowView: Component<ShowViewProps> = (props) => {
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <ShowProvider vm={props.vm} onAction={props.onAction}>
      <div class={cardClasses(props.class)}>
        <Show when={hasChildren()} fallback={<DefaultShowContent />}>
          {resolved()}
        </Show>
      </div>
    </ShowProvider>
  );
};

/**
 * デフォルトの詳細ビュー構成
 */
function DefaultShowContent() {
  return (
    <>
      <ShowHeader />
      <ShowLoading />
      <ShowError />
      <ShowBody />
    </>
  );
}
