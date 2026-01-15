import { For, Show } from "solid-js";
import { ShowVM, type ShowViewModel } from "specloom";
import { css } from "../../styled-system/css";
import { ActionButton } from "./ActionButton.jsx";
import { FieldDisplay } from "./FieldDisplay.jsx";

export interface ShowViewProps {
  vm: ShowViewModel;
  onAction: (actionId: string) => void;
}

export function ShowView(props: ShowViewProps) {
  const groups = () => ShowVM.groups(props.vm);
  const hasGroups = () => groups().length > 0;

  return (
    <div class={css({ display: "flex", flexDirection: "column", gap: 6 })}>
      {/* Header */}
      <div
        class={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <h1 class={css({ fontSize: "2xl", fontWeight: "bold" })}>
          {ShowVM.label(props.vm)}
        </h1>
        <div class={css({ display: "flex", gap: 2 })}>
          <For each={ShowVM.allowedActions(props.vm)}>
            {(action) => (
              <ActionButton action={action} onExecute={props.onAction} />
            )}
          </For>
        </div>
      </div>

      {/* Loading */}
      <Show when={ShowVM.loading(props.vm)}>
        <div class={css({ textAlign: "center", py: 8, color: "gray.500" })}>
          読み込み中...
        </div>
      </Show>

      {/* Error */}
      <Show when={ShowVM.error(props.vm)}>
        <div
          class={css({
            p: 4,
            bg: "red.50",
            borderRadius: "md",
            color: "red.700",
          })}
        >
          {ShowVM.error(props.vm)}
        </div>
      </Show>

      {/* Content */}
      <Show when={!ShowVM.loading(props.vm)}>
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
              })}
            >
              <FieldList fields={ShowVM.fields(props.vm)} />
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
                    px: 4,
                    py: 3,
                    borderBottomWidth: 1,
                    borderColor: "gray.200",
                    fontWeight: "semibold",
                  })}
                >
                  {group.label}
                </div>
                <FieldList fields={ShowVM.fieldsInGroup(props.vm, group.id)} />
              </div>
            )}
          </For>
        </Show>
      </Show>
    </div>
  );
}

function FieldList(props: { fields: ReturnType<typeof ShowVM.fields> }) {
  return (
    <dl class={css({ display: "grid", gap: 0 })}>
      <For each={props.fields}>
        {(field) => (
          <div
            class={css({
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 4,
              px: 4,
              py: 3,
              borderBottomWidth: 1,
              borderColor: "gray.100",
              _last: { borderBottomWidth: 0 },
            })}
          >
            <dt class={css({ color: "gray.600", fontWeight: "medium" })}>
              {field.label}
            </dt>
            <dd>
              <FieldDisplay field={field} value={field.value} />
            </dd>
          </div>
        )}
      </For>
    </dl>
  );
}
