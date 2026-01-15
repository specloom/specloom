import { Show, createSignal } from "solid-js";
import { Dialog } from "@ark-ui/solid/dialog";
import { Portal } from "solid-js/web";
import type { ActionVM } from "specloom";

// ============================================================
// Types
// ============================================================

export interface ActionButtonProps {
  action: ActionVM;
  onExecute: (actionId: string) => void;
}

// ============================================================
// ActionButton Component
// ============================================================

export function ActionButton(props: ActionButtonProps) {
  const [isConfirmOpen, setConfirmOpen] = createSignal(false);

  const handleClick = () => {
    if (props.action.confirm) {
      setConfirmOpen(true);
    } else {
      props.onExecute(props.action.id);
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    props.onExecute(props.action.id);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const variant = () => props.action.ui?.variant ?? "default";

  return (
    <>
      <button
        type="button"
        disabled={!props.action.allowed}
        onClick={handleClick}
        data-variant={variant()}
      >
        <Show when={props.action.ui?.icon}>
          <span data-icon>{props.action.ui?.icon}</span>
        </Show>
        {props.action.label}
      </button>

      {/* Confirmation Dialog */}
      <Show when={props.action.confirm}>
        <Dialog.Root open={isConfirmOpen()} onOpenChange={(e) => setConfirmOpen(e.open)}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Title>確認</Dialog.Title>
                <Dialog.Description>{props.action.confirm}</Dialog.Description>
                <div>
                  <button type="button" onClick={handleCancel}>
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    data-variant={variant()}
                  >
                    実行
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Show>
    </>
  );
}
