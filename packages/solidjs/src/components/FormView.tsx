import { For, Show } from "solid-js";
import type { FormViewModel, FormFieldVM } from "specloom";
import { css } from "../../styled-system/css";
import { styled } from "../../styled-system/jsx";
import { button } from "../../styled-system/recipes";
import { card } from "../../styled-system/recipes";
import { FieldRenderer } from "./FieldRenderer.tsx";
import { ActionButton } from "./ActionButton.tsx";

// ============================================================
// Styled Components
// ============================================================

const StyledButton = styled("button", button);

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
  const cardStyles = card();

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
    <div
      data-specloom="form-view"
      class={css({ display: "flex", flexDirection: "column", gap: "6" })}
    >
      {/* Header */}
      <header data-specloom="form-header">
        <h1
          data-specloom="form-title"
          class={css({ fontSize: "2xl", fontWeight: "semibold" })}
        >
          {title()}
        </h1>
      </header>

      {/* Form Status - Dirty indicator */}
      <Show when={props.vm.isDirty}>
        <div
          data-specloom="form-dirty-indicator"
          class={css({
            py: "2",
            px: "4",
            bg: "accent.a3",
            borderRadius: "md",
            fontSize: "sm",
            color: "accent.11",
            borderWidth: "1px",
            borderColor: "accent.a6",
          })}
        >
          未保存の変更があります
        </div>
      </Show>

      {/* Validation Summary */}
      <Show when={!props.vm.isValid}>
        <ValidationSummary fields={props.vm.fields} />
      </Show>

      {/* Form Card */}
      <div data-specloom="form-card" class={cardStyles.root}>
        <form onSubmit={handleSubmit}>
          <div class={cardStyles.body}>
            {/* Fields Grid */}
            <div
              data-specloom="form-fields"
              class={css({
                display: "grid",
                gap: "5",
                gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
              })}
            >
              <For each={props.vm.fields}>
                {(field) => (
                  <div
                    data-specloom="form-field-wrapper"
                    data-field={field.name}
                    class={css({
                      gridColumn:
                        field.kind === "longText"
                          ? { md: "span 2" }
                          : undefined,
                    })}
                  >
                    <FieldRenderer
                      field={field}
                      mode="input"
                      onChange={handleFieldChange(field.name)}
                    />
                  </div>
                )}
              </For>
            </div>
          </div>

          {/* Actions Footer */}
          <div
            data-specloom="form-actions"
            class={css({
              display: "flex",
              gap: "3",
              justifyContent: "flex-end",
              px: "6",
              py: "4",
              borderTopWidth: "1px",
              borderColor: "border.default",
              bg: "bg.subtle",
            })}
          >
            <For each={props.vm.actions}>
              {(action) => (
                <ActionButton action={action} onExecute={props.onAction} />
              )}
            </For>
          </div>
        </form>
      </div>
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
      <div
        data-specloom="form-validation-summary"
        class={css({
          p: "4",
          bg: "red.a2",
          borderWidth: "1px",
          borderColor: "red.a6",
          borderRadius: "md",
        })}
        role="alert"
      >
        <div class={css({ fontWeight: "medium", color: "fg.error", mb: "2" })}>
          入力内容に問題があります
        </div>
        <ul
          class={css({
            listStyleType: "disc",
            pl: "5",
            color: "fg.error",
            fontSize: "sm",
          })}
        >
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
