import { type Component, Show, For } from "solid-js";
import type { FormFieldVM } from "specloom";
import { useForm } from "./context.jsx";
import { FieldInput } from "../shared/FieldInput.jsx";

export interface FormFieldProps {
  field: FormFieldVM;
  value?: unknown;
  class?: string;
}

/**
 * FormField - 個別のフォームフィールド
 */
export const FormField: Component<FormFieldProps> = (props) => {
  const { vm, values, onChange, onOptionsSearch } = useForm();

  const fieldValue = () => props.value ?? values()[props.field.name];
  const hasError = () => vm().hasError(props.field.name);
  const errors = () => vm().fieldErrors(props.field.name);

  return (
    <div class={props.class ?? "space-y-2"}>
      {/* Label */}
      <FormFieldLabel field={props.field} />

      {/* Input */}
      <FieldInput
        field={props.field}
        value={fieldValue()}
        onChange={onChange}
        onOptionsSearch={onOptionsSearch}
      />

      {/* Hint */}
      <Show when={props.field.hint}>
        <FormFieldHint hint={props.field.hint!} />
      </Show>

      {/* Errors */}
      <Show when={hasError()}>
        <FormFieldErrors errors={errors()} />
      </Show>
    </div>
  );
};

export interface FormFieldLabelProps {
  field: FormFieldVM;
  class?: string;
}

/**
 * FormFieldLabel - フィールドのラベル
 */
export const FormFieldLabel: Component<FormFieldLabelProps> = (props) => {
  return (
    <label
      for={props.field.name}
      class={
        props.class ??
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
      }
    >
      {props.field.label}
      <Show when={props.field.required}>
        <span class="ml-0.5 text-destructive">*</span>
      </Show>
    </label>
  );
};

export interface FormFieldHintProps {
  hint: string;
  class?: string;
}

/**
 * FormFieldHint - フィールドのヒント
 */
export const FormFieldHint: Component<FormFieldHintProps> = (props) => {
  return (
    <p class={props.class ?? "text-[0.8rem] text-muted-foreground"}>
      {props.hint}
    </p>
  );
};

export interface FormFieldErrorsProps {
  errors: string[];
  class?: string;
}

/**
 * FormFieldErrors - フィールドのエラー表示
 */
export const FormFieldErrors: Component<FormFieldErrorsProps> = (props) => {
  return (
    <For each={props.errors}>
      {(error) => (
        <p class={props.class ?? "text-[0.8rem] font-medium text-destructive"}>
          {error}
        </p>
      )}
    </For>
  );
};
