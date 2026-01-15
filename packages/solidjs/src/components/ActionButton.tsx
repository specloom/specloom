import { createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { Dialog } from "@ark-ui/solid/dialog";
import { ActionVMHelper, type ActionVM } from "specloom";
import { css } from "../../styled-system/css";

export interface ActionButtonProps {
  action: ActionVM;
  onExecute: (actionId: string) => void;
  size?: "sm" | "md" | "lg";
}

export function ActionButton(props: ActionButtonProps) {
  const [confirmOpen, setConfirmOpen] = createSignal(false);

  const handleClick = () => {
    if (ActionVMHelper.needsConfirm(props.action)) {
      setConfirmOpen(true);
    } else {
      props.onExecute(props.action.id);
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    props.onExecute(props.action.id);
  };

  const variant = () => ActionVMHelper.variant(props.action) ?? "default";

  return (
    <>
      <button
        type="button"
        class={css({
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2",
          borderRadius: "md",
          fontWeight: "medium",
          transition: "colors",
          px: props.size === "sm" ? "3" : props.size === "lg" ? "6" : "4",
          py: props.size === "sm" ? "1.5" : props.size === "lg" ? "3" : "2",
          fontSize: props.size === "sm" ? "sm" : props.size === "lg" ? "lg" : "md",
          bg: variant() === "danger" ? "red.500" : variant() === "primary" ? "blue.500" : "gray.100",
          color: variant() === "danger" || variant() === "primary" ? "white" : "gray.900",
          _hover: {
            bg: variant() === "danger" ? "red.600" : variant() === "primary" ? "blue.600" : "gray.200",
          },
          _disabled: {
            opacity: 0.5,
            cursor: "not-allowed",
          },
        })}
        disabled={!ActionVMHelper.allowed(props.action)}
        onClick={handleClick}
      >
        <Show when={ActionVMHelper.icon(props.action)}>
          <span class={css({ fontSize: "lg" })}>{ActionVMHelper.icon(props.action)}</span>
        </Show>
        {props.action.label}
      </button>

      <Show when={ActionVMHelper.needsConfirm(props.action)}>
        <Dialog.Root open={confirmOpen()} onOpenChange={(e) => setConfirmOpen(e.open)}>
          <Portal>
            <Dialog.Backdrop
              class={css({
                position: "fixed",
                inset: 0,
                bg: "black/50",
                zIndex: 50,
              })}
            />
            <Dialog.Positioner
              class={css({
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
              })}
            >
              <Dialog.Content
                class={css({
                  bg: "white",
                  borderRadius: "lg",
                  p: 6,
                  shadow: "lg",
                  maxW: "md",
                  w: "full",
                  mx: 4,
                })}
              >
                <Dialog.Title class={css({ fontWeight: "bold", fontSize: "lg", mb: 2 })}>
                  確認
                </Dialog.Title>
                <Dialog.Description class={css({ color: "gray.600", mb: 6 })}>
                  {ActionVMHelper.confirmMsg(props.action)}
                </Dialog.Description>
                <div class={css({ display: "flex", gap: 3, justifyContent: "flex-end" })}>
                  <button
                    type="button"
                    class={css({
                      px: 4,
                      py: 2,
                      borderRadius: "md",
                      bg: "gray.100",
                      color: "gray.900",
                      fontWeight: "medium",
                      cursor: "pointer",
                      _hover: { bg: "gray.200" },
                    })}
                    onClick={() => setConfirmOpen(false)}
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    class={css({
                      px: 4,
                      py: 2,
                      borderRadius: "md",
                      bg: variant() === "danger" ? "red.500" : "blue.500",
                      color: "white",
                      fontWeight: "medium",
                      cursor: "pointer",
                      _hover: { bg: variant() === "danger" ? "red.600" : "blue.600" },
                    })}
                    onClick={handleConfirm}
                  >
                    {props.action.label}
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
