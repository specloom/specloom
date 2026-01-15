import { For } from "solid-js";
import type { ShowViewModel } from "specloom";
import { css } from "../../styled-system/css";
import { card } from "../../styled-system/recipes";
import { FieldRenderer } from "./FieldRenderer.tsx";
import { ActionButton } from "./ActionButton.tsx";

// ============================================================
// Types
// ============================================================

export interface ShowViewProps {
  vm: ShowViewModel;
  onAction: (actionId: string) => void;
}

// ============================================================
// ShowView Component
// ============================================================

export function ShowView(props: ShowViewProps) {
  const cardStyles = card();

  return (
    <div
      data-specloom="show-view"
      class={css({ display: "flex", flexDirection: "column", gap: "6" })}
    >
      {/* Header */}
      <header
        data-specloom="show-header"
        class={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <h1
          data-specloom="show-title"
          class={css({ fontSize: "2xl", fontWeight: "semibold" })}
        >
          {props.vm.label}
        </h1>

        {/* Actions */}
        <div
          data-specloom="show-actions"
          class={css({ display: "flex", gap: "2" })}
        >
          <For each={props.vm.actions}>
            {(action) => (
              <ActionButton action={action} onExecute={props.onAction} />
            )}
          </For>
        </div>
      </header>

      {/* Fields Card */}
      <div data-specloom="show-card" class={cardStyles.root}>
        <div class={cardStyles.body}>
          <dl
            data-specloom="show-fields"
            class={css({
              display: "grid",
              gap: "4",
              gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
            })}
          >
            <For each={props.vm.fields}>
              {(field) => (
                <div
                  data-specloom="show-field"
                  data-field={field.name}
                  class={css({
                    display: "flex",
                    flexDirection: "column",
                    gap: "1",
                    pb: "3",
                    borderBottomWidth: "1px",
                    borderColor: "border.subtle",
                    gridColumn:
                      field.kind === "longText" ? "span 2" : undefined,
                  })}
                >
                  <FieldRenderer field={field} mode="display" />
                </div>
              )}
            </For>
          </dl>
        </div>
      </div>
    </div>
  );
}
