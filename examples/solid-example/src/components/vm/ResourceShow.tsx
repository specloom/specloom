import { For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { ShowVM, ActionVM, ShowFieldVM } from "specloom";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface ResourceShowProps {
  vm: ShowVM;
  basePath: string;
  onAction?: (actionId: string) => void;
}

function statusVariant(value: unknown): "default" | "secondary" | "success" | "warning" | "error" | "outline" {
  switch (value) {
    case "open":
    case "active":
      return "success";
    case "preparing":
      return "warning";
    case "closed":
    case "suspended":
      return "error";
    default:
      return "secondary";
  }
}

function defaultActionHandler(basePath: string, id: string, navigate: (path: string) => void) {
  return (actionId: string) => {
    switch (actionId) {
      case "edit":
        navigate(`${basePath}/${id}/edit`);
        break;
      case "delete":
        if (confirm("削除しますか？")) {
          navigate(basePath);
        }
        break;
    }
  };
}

export function ResourceShow(props: ResourceShowProps) {
  const vm = () => props.vm;
  const navigate = useNavigate();
  const handleAction = () =>
    props.onAction ?? defaultActionHandler(props.basePath, vm().id, navigate);

  return (
    <div class="space-y-6">
      <div class="flex gap-2">
        <For each={vm().allowedActions}>
          {(action: ActionVM) => (
            <Button
              variant={
                action.ui?.variant === "danger"
                  ? "destructive"
                  : action.ui?.variant === "primary"
                    ? "default"
                    : "outline"
              }
              size="sm"
              onClick={() => handleAction()(action.id)}
            >
              {action.label}
            </Button>
          )}
        </For>
      </div>

      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <For each={vm().fields.filter((f: ShowFieldVM) => f.visible !== false)}>
          {(field: ShowFieldVM) => {
            const formatted = vm().formatValue(field, field.value);
            return (
              <div class="space-y-1">
                <dt class="text-sm font-medium text-muted-foreground">
                  {field.label}
                </dt>
                <dd class="text-sm">
                  <FieldValue kind={field.kind} value={field.value} formatted={formatted} />
                </dd>
              </div>
            );
          }}
        </For>
      </dl>
    </div>
  );
}

function FieldValue(props: { kind: string; value: unknown; formatted: string }) {
  return (
    <Show
      when={props.kind === "status" || props.kind === "enum"}
      fallback={
        <Show
          when={props.kind === "url" && props.value}
          fallback={<span>{props.formatted || "—"}</span>}
        >
          <a
            href={String(props.value)}
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
          >
            {props.formatted}
          </a>
        </Show>
      }
    >
      <Show when={props.formatted} fallback={<span>—</span>}>
        <Badge variant={statusVariant(props.value)}>{props.formatted}</Badge>
      </Show>
    </Show>
  );
}
