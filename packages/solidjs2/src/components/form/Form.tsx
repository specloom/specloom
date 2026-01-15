import { type Component, For, Show } from "solid-js";
import type { FormViewModel } from "specloom";
import { FormVM } from "specloom";
import { FormField } from "./FormField.jsx";
import { FormGroup } from "./FormGroup.jsx";
import { FormActions } from "./FormActions.jsx";
import { Button, cardClasses } from "../ui/index.js";

export interface FormProps {
  vm: FormViewModel;
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;
  class?: string;
}

export const Form: Component<FormProps> = (props) => {
  const groups = () => FormVM.groups(props.vm);
  const hasGroups = () => groups().length > 0;
  const values = () => FormVM.values(props.vm);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (FormVM.canSubmit(props.vm)) {
      props.onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class={cardClasses(props.class)}
    >
      {/* Header */}
      <div class="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 class="text-lg font-semibold text-foreground">
            {FormVM.label(props.vm)}
          </h2>
        </div>
        <Show when={props.onAction}>
          <FormActions
            actions={FormVM.allowedActions(props.vm)}
            onAction={props.onAction!}
          />
        </Show>
      </div>

      {/* Loading */}
      <Show when={FormVM.loading(props.vm)}>
        <div class="flex items-center justify-center py-12">
          <div class="flex items-center gap-2 text-muted-foreground">
            <svg
              class="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
            </svg>
            <span class="text-sm">読み込み中...</span>
          </div>
        </div>
      </Show>

      {/* Error */}
      <Show when={FormVM.error(props.vm)}>
        <div class="mx-6 mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <div class="flex items-center gap-2">
            <svg
              class="h-5 w-5 text-destructive"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p class="text-sm font-medium text-destructive">
              {FormVM.error(props.vm)}
            </p>
          </div>
        </div>
      </Show>

      {/* Fields */}
      <Show when={!FormVM.loading(props.vm)}>
        <div class="p-6">
          <Show
            when={hasGroups()}
            fallback={
              <div class="space-y-6">
                <For each={FormVM.visibleFields(props.vm)}>
                  {(field) => (
                    <FormField
                      field={field}
                      vm={props.vm}
                      value={values()[field.name]}
                      onChange={props.onChange}
                    />
                  )}
                </For>
              </div>
            }
          >
            <div class="space-y-8">
              <For each={groups()}>
                {(group) => (
                  <FormGroup
                    group={group}
                    fields={FormVM.fieldsInGroup(props.vm, group.id)}
                    vm={props.vm}
                    values={values()}
                    onChange={props.onChange}
                  />
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Footer */}
        <div class="flex items-center justify-end gap-3 border-t border-border bg-muted/40 px-6 py-4">
          <Button
            type="submit"
            disabled={!FormVM.canSubmit(props.vm)}
            variant="primary"
          >
            {FormVM.submitting(props.vm) ? (
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
            )}
          </Button>
        </div>
      </Show>
    </form>
  );
};
