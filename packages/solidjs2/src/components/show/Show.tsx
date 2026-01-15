import { type Component, For, Show as SolidShow } from "solid-js";
import type { ShowViewModel } from "specloom";
import { ShowVM } from "specloom";
import { ShowField } from "./ShowField.jsx";
import { ShowGroup } from "./ShowGroup.jsx";
import { ActionButton } from "../shared/ActionButton.jsx";
import { cardClasses } from "../ui/index.js";

export interface ShowProps {
  vm: ShowViewModel;
  onAction?: (actionId: string) => void;
  class?: string;
}

export const Show: Component<ShowProps> = (props) => {
  const groups = () => ShowVM.groups(props.vm);
  const hasGroups = () => groups().length > 0;

  return (
    <div
      class={cardClasses(props.class)}
    >
      {/* Header */}
      <div class="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 class="text-lg font-semibold text-foreground">
            {ShowVM.label(props.vm)}
          </h2>
        </div>
        <SolidShow when={props.onAction}>
          <div class="flex items-center gap-2">
            <For each={ShowVM.allowedActions(props.vm)}>
              {(action) => (
                <ActionButton action={action} onExecute={props.onAction!} />
              )}
            </For>
          </div>
        </SolidShow>
      </div>

      {/* Loading */}
      <SolidShow when={ShowVM.loading(props.vm)}>
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
      </SolidShow>

      {/* Error */}
      <SolidShow when={ShowVM.error(props.vm)}>
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
              {ShowVM.error(props.vm)}
            </p>
          </div>
        </div>
      </SolidShow>

      {/* Content */}
      <SolidShow when={!ShowVM.loading(props.vm)}>
        <div class="p-6">
          <SolidShow
            when={hasGroups()}
            fallback={
              <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <For each={ShowVM.fields(props.vm)}>
                  {(field) => (
                    <ShowField
                      field={field}
                      value={ShowVM.value(props.vm, field.name)}
                    />
                  )}
                </For>
              </dl>
            }
          >
            <div class="space-y-8">
              <For each={groups()}>
                {(group) => (
                  <ShowGroup
                    group={group}
                    fields={ShowVM.fieldsInGroup(props.vm, group.id)}
                    vm={props.vm}
                  />
                )}
              </For>
            </div>
          </SolidShow>
        </div>
      </SolidShow>
    </div>
  );
};
