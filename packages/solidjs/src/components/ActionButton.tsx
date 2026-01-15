import { Show, createSignal } from "solid-js";
import { Dialog } from "@ark-ui/solid/dialog";
import { Portal } from "solid-js/web";
import { styled } from "../../styled-system/jsx";
import { button } from "../../styled-system/recipes";
import { dialog } from "../../styled-system/recipes";
import { css } from "../../styled-system/css";
import type { ActionVM } from "specloom";

// ============================================================
// Styled Components
// ============================================================

const StyledButton = styled("button", button);

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

  const buttonVariant = ():
    | "solid"
    | "outline"
    | "ghost"
    | "link"
    | "subtle" => {
    const variant = props.action.ui?.variant;
    switch (variant) {
      case "primary":
        return "solid";
      case "danger":
        return "solid";
      case "secondary":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <>
      <StyledButton
        data-specloom="action-button"
        data-action={props.action.id}
        data-variant={props.action.ui?.variant}
        type="button"
        disabled={!props.action.allowed}
        onClick={handleClick}
        variant={buttonVariant()}
        size="sm"
        class={
          props.action.ui?.variant === "danger"
            ? css({ colorPalette: "red" })
            : undefined
        }
      >
        <Show when={props.action.ui?.icon}>
          <span>{props.action.ui?.icon}</span>
        </Show>
        {props.action.label}
      </StyledButton>

      {/* Confirmation Dialog */}
      <Show when={props.action.confirm}>
        <Dialog.Root
          open={isConfirmOpen()}
          onOpenChange={(e) => setConfirmOpen(e.open)}
        >
          <Portal>
            <Dialog.Backdrop class={dialog().backdrop} />
            <Dialog.Positioner class={dialog().positioner}>
              <Dialog.Content
                data-specloom="confirm-dialog"
                class={dialog().content}
              >
                <Dialog.Title
                  data-specloom="confirm-title"
                  class={dialog().title}
                >
                  確認
                </Dialog.Title>
                <Dialog.Description class={dialog().description}>
                  {props.action.confirm}
                </Dialog.Description>
                <div
                  class={css({
                    display: "flex",
                    gap: "3",
                    justifyContent: "flex-end",
                    mt: "4",
                  })}
                >
                  <StyledButton
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    キャンセル
                  </StyledButton>
                  <StyledButton
                    type="button"
                    variant="solid"
                    onClick={handleConfirm}
                    class={
                      props.action.ui?.variant === "danger"
                        ? css({ colorPalette: "red" })
                        : undefined
                    }
                  >
                    実行
                  </StyledButton>
                </div>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Show>
    </>
  );
}
