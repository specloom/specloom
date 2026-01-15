import { For, Show } from "solid-js";
import { FormVM, type FormViewModel } from "specloom";
import { css } from "../../styled-system/css";
import { ActionButton } from "./ActionButton.js";
import { FieldInput } from "./FieldInput.js";

export interface FormViewProps {
  vm: FormViewModel;
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction: (actionId: string) => void;
}

export function FormView(props: FormViewProps) {
  const groups = () => FormVM.groups(props.vm);
  const hasGroups = () => groups().length > 0;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (FormVM.canSubmit(props.vm)) {
      props.onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class={css({ display: "flex", flexDirection: "column", gap: 6 })}
    >
      {/* Header */}
      <div
        class={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <h1 class={css({ fontSize: "2xl", fontWeight: "bold" })}>{FormVM.label(props.vm)}</h1>
        <div class={css({ display: "flex", gap: 2 })}>
          <For each={FormVM.allowedActions(props.vm)}>
            {(action) => <ActionButton action={action} onExecute={props.onAction} />}
          </For>
        </div>
      </div>

      {/* Loading */}
      <Show when={FormVM.loading(props.vm)}>
        <div class={css({ textAlign: "center", py: 8, color: "gray.500" })}>読み込み中...</div>
      </Show>

      {/* Error */}
      <Show when={FormVM.error(props.vm)}>
        <div
          class={css({
            p: 4,
            bg: "red.50",
            borderRadius: "md",
            color: "red.700",
          })}
        >
          {FormVM.error(props.vm)}
        </div>
      </Show>

      {/* Form Content */}
      <Show when={!FormVM.loading(props.vm)}>
        <Show
          when={hasGroups()}
          fallback={
            <div
              class={css({
                bg: "white",
                borderRadius: "lg",
                shadow: "sm",
                borderWidth: 1,
                borderColor: "gray.200",
                p: 6,
              })}
            >
              <FieldGroup
                fields={FormVM.visibleFields(props.vm)}
                vm={props.vm}
                onChange={props.onChange}
              />
            </div>
          }
        >
          <For each={groups()}>
            {(group) => (
              <div
                class={css({
                  bg: "white",
                  borderRadius: "lg",
                  shadow: "sm",
                  borderWidth: 1,
                  borderColor: "gray.200",
                })}
              >
                <div
                  class={css({
                    px: 6,
                    py: 4,
                    borderBottomWidth: 1,
                    borderColor: "gray.200",
                    fontWeight: "semibold",
                  })}
                >
                  {group.label}
                </div>
                <div class={css({ p: 6 })}>
                  <FieldGroup
                    fields={FormVM.fieldsInGroup(props.vm, group.id)}
                    vm={props.vm}
                    onChange={props.onChange}
                  />
                </div>
              </div>
            )}
          </For>
        </Show>

        {/* Submit Button */}
        <div class={css({ display: "flex", justifyContent: "flex-end", gap: 3 })}>
          <button
            type="submit"
            disabled={!FormVM.canSubmit(props.vm)}
            class={css({
              px: 6,
              py: 2.5,
              borderRadius: "md",
              bg: "blue.500",
              color: "white",
              fontWeight: "medium",
              cursor: "pointer",
              _hover: { bg: "blue.600" },
              _disabled: { opacity: 0.5, cursor: "not-allowed" },
            })}
          >
            <Show when={FormVM.submitting(props.vm)} fallback="保存">
              保存中...
            </Show>
          </button>
        </div>
      </Show>
    </form>
  );
}

function FieldGroup(props: {
  fields: ReturnType<typeof FormVM.visibleFields>;
  vm: FormViewModel;
  onChange: (name: string, value: unknown) => void;
}) {
  return (
    <div class={css({ display: "flex", flexDirection: "column", gap: 5 })}>
      <For each={props.fields}>
        {(field) => (
          <div class={css({ display: "flex", flexDirection: "column", gap: 1.5 })}>
            {/* Label */}
            <label
              for={field.name}
              class={css({
                fontWeight: "medium",
                color: "gray.700",
                display: "flex",
                alignItems: "center",
                gap: 1,
              })}
            >
              {field.label}
              <Show when={field.required}>
                <span class={css({ color: "red.500" })}>*</span>
              </Show>
            </label>

            {/* Input */}
            <FieldInput
              field={field}
              value={field.value}
              errors={FormVM.fieldErrors(props.vm, field.name)}
              onChange={props.onChange}
            />

            {/* Hint */}
            <Show when={field.hint}>
              <p class={css({ fontSize: "sm", color: "gray.500" })}>{field.hint}</p>
            </Show>

            {/* Errors */}
            <Show when={FormVM.hasError(props.vm, field.name)}>
              <For each={FormVM.fieldErrors(props.vm, field.name)}>
                {(error) => <p class={css({ fontSize: "sm", color: "red.500" })}>{error}</p>}
              </For>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
