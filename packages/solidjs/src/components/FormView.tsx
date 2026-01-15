import { For, Show, createSignal } from "solid-js";
import type { FormViewModel, FormFieldVM } from "specloom";
import { FieldRenderer } from "./FieldRenderer.tsx";
import { ActionButton } from "./ActionButton.tsx";

// ============================================================
// Types
// ============================================================

export interface FormViewProps {
  vm: FormViewModel;
  onAction: (actionId: string) => void;
  onFieldChange: (fieldName: string, value: unknown) => void;
  onSubmit?: () => void;
}

// ============================================================
// FormView Component
// ============================================================

export function FormView(props: FormViewProps) {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit?.();
  };

  const handleFieldChange = (fieldName: string) => (value: unknown) => {
    props.onFieldChange(fieldName, value);
  };

  const title = () => {
    const modeLabel = props.vm.mode === "create" ? "新規作成" : "編集";
    return `${props.vm.label} - ${modeLabel}`;
  };

  return (
    <div data-component="form-view">
      {/* Header */}
      <header>
        <h1>{title()}</h1>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Fields */}
        <div data-slot="fields">
          <For each={props.vm.fields}>
            {(field) => (
              <div data-slot="field-wrapper">
                <FieldRenderer
                  field={field}
                  mode="input"
                  onChange={handleFieldChange(field.name)}
                />
              </div>
            )}
          </For>
        </div>

        {/* Form Status */}
        <Show when={props.vm.isDirty}>
          <div data-slot="status">
            <span data-dirty>未保存の変更があります</span>
          </div>
        </Show>

        {/* Validation Summary */}
        <Show when={!props.vm.isValid}>
          <ValidationSummary fields={props.vm.fields} />
        </Show>

        {/* Actions */}
        <div data-slot="actions">
          <For each={props.vm.actions}>
            {(action) => (
              <ActionButton action={action} onExecute={props.onAction} />
            )}
          </For>
        </div>
      </form>
    </div>
  );
}

// ============================================================
// ValidationSummary Component
// ============================================================

interface ValidationSummaryProps {
  fields: FormFieldVM[];
}

function ValidationSummary(props: ValidationSummaryProps) {
  const fieldsWithErrors = () =>
    props.fields.filter((f) => f.errors.length > 0);

  return (
    <Show when={fieldsWithErrors().length > 0}>
      <div data-slot="validation-summary" role="alert">
        <p>入力内容に問題があります：</p>
        <ul>
          <For each={fieldsWithErrors()}>
            {(field) => (
              <li>
                <strong>{field.label}:</strong> {field.errors.join(", ")}
              </li>
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
}
