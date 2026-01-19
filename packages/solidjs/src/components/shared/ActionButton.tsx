import { type Component, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { Dialog } from "@ark-ui/solid/dialog";
import type { ActionVM } from "specloom";
import { ActionVMHelper } from "specloom";
import { Button } from "../ui/index.js";

export interface ActionButtonProps {
  action: ActionVM;
  onExecute: (actionId: string) => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "destructive" | "outline" | "ghost";
  class?: string;
}

export const ActionButton: Component<ActionButtonProps> = (props) => {
  const [open, setOpen] = createSignal(false);

  const actionVariant = () => ActionVMHelper.variant(props.action);
  const needsConfirm = () => ActionVMHelper.needsConfirm(props.action);
  const confirmMsg = () => ActionVMHelper.confirmMsg(props.action);
  const allowed = () => ActionVMHelper.isAllowed(props.action);

  const buttonVariant = () => {
    // props.variant が指定されていればそれを優先
    if (props.variant) return props.variant;

    switch (actionVariant()) {
      case "primary":
        return "primary";
      case "danger":
        return "destructive";
      case "ghost":
        return "ghost";
      default:
        return "outline";
    }
  };

  const handleClick = () => {
    if (needsConfirm()) {
      setOpen(true);
    } else {
      props.onExecute(props.action.id);
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    props.onExecute(props.action.id);
  };

  return (
    <>
      <Button
        type="button"
        variant={buttonVariant()}
        size={props.size ?? "md"}
        class={props.class}
        disabled={!allowed()}
        onClick={handleClick}
      >
        <Show when={ActionVMHelper.icon(props.action)}>
          <span class="mr-2">{ActionVMHelper.icon(props.action)}</span>
        </Show>
        {props.action.label}
      </Button>

      <Show when={needsConfirm()}>
        <Dialog.Root open={open()} onOpenChange={(e) => setOpen(e.open)}>
          <Portal>
            <Dialog.Backdrop class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
              <Dialog.Content class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                  <Dialog.Title class="text-lg font-semibold leading-none tracking-tight text-foreground">
                    確認
                  </Dialog.Title>
                  <Dialog.Description class="text-sm text-muted-foreground">
                    {confirmMsg() ?? `${props.action.label}を実行しますか？`}
                  </Dialog.Description>
                </div>
                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <Dialog.CloseTrigger class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
                    キャンセル
                  </Dialog.CloseTrigger>
                  <Button
                    type="button"
                    variant={
                      actionVariant() === "danger" ? "destructive" : "primary"
                    }
                    size="sm"
                    onClick={handleConfirm}
                  >
                    実行
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Show>
    </>
  );
};
