import type { ActionVM } from "specloom";
import { useI18n } from "@specloom/solidjs";
import { createSignal } from "solid-js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

export function ActionButton(props: {
  action: ActionVM;
  size?: "default" | "sm" | "lg" | "icon";
  onAction: (action: ActionVM) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = createSignal(false);

  const runAction = () => props.onAction(props.action);
  const buttonVariant =
    props.action.prominence === "danger"
      ? "destructive"
      : props.action.prominence === "primary"
        ? "default"
        : "outline";

  if (!props.action.confirm) {
    return (
      <Button
        type="button"
        variant={buttonVariant}
        size={props.size ?? "sm"}
        disabled={props.action.disabled}
        onClick={runAction}
      >
        {props.action.label}
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant={buttonVariant}
        size={props.size ?? "sm"}
        disabled={props.action.disabled}
        onClick={() => setOpen(true)}
      >
        {props.action.label}
      </Button>
      <AlertDialog open={open()} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>
            {props.action.confirm.title ?? props.action.label}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {props.action.confirm.message}
          </AlertDialogDescription>
          <div class="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {props.action.confirm.cancelLabel ?? t("form.cancel")}
            </Button>
            <Button
              type="button"
              variant={buttonVariant}
              onClick={() => {
                setOpen(false);
                runAction();
              }}
            >
              {props.action.confirm.confirmLabel ?? props.action.label}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
