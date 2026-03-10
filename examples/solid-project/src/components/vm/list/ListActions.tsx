import type { ActionVM } from "specloom";
import { useI18n } from "@specloom/solidjs";
import { For, Show } from "solid-js";
import { ActionButton } from "~/components/vm/ActionButton";

export function ListSelectionInfo(props: {
  mode: "none" | "single" | "multi";
  selectedCount: number;
}) {
  const { t } = useI18n();

  return (
    <Show when={props.mode !== "none"}>
      <div class="mt-2 text-sm text-muted-foreground">
        <Show when={props.selectedCount > 0}>
          {t("list.selectedCount", { count: props.selectedCount })}
        </Show>
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
        <ActionButtons actions={props.actions} onAction={props.onAction} />
      </div>
    </Show>
  );
}

export function ListSelectionActions(props: {
  actions: ActionVM[];
  selectedCount: number;
  onAction: (action: ActionVM) => void;
}) {
  return (
    <Show when={props.actions.length > 0 && props.selectedCount > 0}>
      <div class="mt-3 flex gap-2">
        <ActionButtons actions={props.actions} onAction={props.onAction} />
      </div>
    </Show>
  );
}

function ActionButtons(props: {
  actions: ActionVM[];
  onAction: (action: ActionVM) => void;
}) {
  return (
    <For each={props.actions}>
      {(action) => (
        <Show when={action.visible}>
          <ActionButton action={action} size="sm" onAction={props.onAction} />
        </Show>
      )}
    </For>
  );
}
