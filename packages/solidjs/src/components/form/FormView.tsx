import {
  type Component,
  type JSX,
  children as resolveChildren,
  Show,
} from "solid-js";
import type { FormViewModel } from "specloom";
import { FormProvider, useForm } from "./context.jsx";
import { FormHeader } from "./FormHeader.jsx";
import { FormBody } from "./FormBody.jsx";
import { FormFooter } from "./FormFooter.jsx";
import { FormLoading } from "./FormLoading.jsx";
import { FormError } from "./FormError.jsx";
import { cardClasses } from "../ui/index.js";

export interface FormViewProps {
  vm: FormViewModel;
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;
  class?: string;
  children?: JSX.Element;
}

/**
 * FormView - Headless + 組み立て式のフォームビュー
 *
 * @example
 * // シンプルに使う（デフォルト構成）
 * <FormView vm={vm} onChange={handleChange} onSubmit={handleSubmit} />
 *
 * @example
 * // カスタマイズする
 * <FormView vm={vm} onChange={handleChange} onSubmit={handleSubmit}>
 *   <FormHeader />
 *   <FormBody>
 *     {(field) => <MyCustomField field={field} />}
 *   </FormBody>
 *   <FormFooter />
 * </FormView>
 */
export const FormView: Component<FormViewProps> = (props) => {
  const resolved = resolveChildren(() => props.children);

  const hasChildren = () => {
    const c = resolved();
    return (
      c !== undefined && c !== null && (Array.isArray(c) ? c.length > 0 : true)
    );
  };

  return (
    <FormProvider
      vm={props.vm}
      onChange={props.onChange}
      onSubmit={props.onSubmit}
      onAction={props.onAction}
    >
      <FormViewInner class={props.class} hasChildren={hasChildren}>
        <Show when={hasChildren()} fallback={<DefaultFormContent />}>
          {resolved()}
        </Show>
      </FormViewInner>
    </FormProvider>
  );
};

interface FormViewInnerProps {
  class?: string;
  hasChildren: () => boolean;
  children: JSX.Element;
}

const FormViewInner: Component<FormViewInnerProps> = (props) => {
  const { onSubmit, canSubmit } = useForm();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (canSubmit()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} class={cardClasses(props.class)}>
      {props.children}
    </form>
  );
};

/**
 * デフォルトのフォーム構成
 */
function DefaultFormContent() {
  return (
    <>
      <FormHeader />
      <FormLoading />
      <FormError />
      <FormBody />
      <FormFooter />
    </>
  );
}
