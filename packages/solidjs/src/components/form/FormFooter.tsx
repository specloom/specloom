import {
  type Component,
  type JSX,
  Show,
  children as resolveChildren,
} from "solid-js";
import { useForm } from "./context.jsx";
import { Button } from "../ui/index.js";

export interface FormFooterProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * FormFooter - フォームのフッター部分（送信ボタン等）
 */
export const FormFooter: Component<FormFooterProps> = (props) => {
  const { loading } = useForm();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <Show when={!loading()}>
      <div
        class={
          props.class ??
          "flex items-center justify-end gap-3 border-t border-border bg-muted/40 px-6 py-4"
        }
      >
        <Show when={hasChildren()} fallback={<FormSubmitButton />}>
          {resolved()}
        </Show>
      </div>
    </Show>
  );
};

export interface FormSubmitButtonProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * FormSubmitButton - 送信ボタン
 */
export const FormSubmitButton: Component<FormSubmitButtonProps> = (props) => {
  const { canSubmit, submitting } = useForm();
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <Button
      type="submit"
      disabled={!canSubmit()}
      variant="primary"
      class={props.class}
    >
      <Show
        when={hasChildren()}
        fallback={
          submitting() ? (
            <>
              <svg
                class="mr-2 h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
              </svg>
              保存中...
            </>
          ) : (
            "保存"
          )
        }
      >
        {resolved()}
      </Show>
    </Button>
  );
};
