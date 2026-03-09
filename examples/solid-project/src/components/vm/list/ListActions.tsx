import type { ActionVM } from "specloom";
import { useI18n } from "@specloom/solidjs";
import { For, Show } from "solid-js";
import { Button } from "~/components/ui/button";

export function ListSelectionInfo(props: {
  mode: "none" | "single" | "multi";
  selectedCount: number;
}) {
  const { t } = useI18n();

  return (
    <Show when={props.mode !== "none"}>
      <div class="mt-2 text-sm text-muted-foreground">
        {t("list.selectionMode", { mode: props.mode })}
        {props.selectedCount > 0 &&
          ` ${t("list.selectedCount", { count: props.selectedCount })}`}
      </div>
    </Show>
  );
}

export function ListPageActions(props: {
  actions: ActionVM[];
  onAction: (action: ActionVM) => void;
}) {
  return (
    <Show when={props.actions.length > 0}>
      <div class="mt-4 flex gap-2">
        <For each={props.actions}>
          {(action) => (
            <Show when={action.visible}>
              <Button
                variant={
                  action.prominence === "primary" ? "default" : "outline"
                }
                size="sm"
                disabled={action.disabled}
                onClick={() => props.onAction(action)}
              >
                {action.label}
              </Button>
            </Show>
          )}
        </For>
      </div>
    </Show>
  );
}
