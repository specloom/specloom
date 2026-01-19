import {
  type Component,
  type JSX,
  Show,
  children as resolveChildren,
} from "solid-js";
import { useForm } from "./context.jsx";
import { FormActions } from "./FormActions.jsx";

export interface FormHeaderProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * FormHeader - フォームのヘッダー部分
 */
export const FormHeader: Component<FormHeaderProps> = (props) => {
  const { label, onAction } = useForm();
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
              <FormActions />
            </Show>
          </>
        }
      >
        {resolved()}
      </Show>
    </div>
  );
};

export interface FormTitleProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * FormTitle - フォームのタイトル
 */
export const FormTitle: Component<FormTitleProps> = (props) => {
  const { label } = useForm();
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
