import { type Component, Switch, Match } from "solid-js";
import type { ShowFieldVM, ListFieldVM } from "specloom";
import { Format } from "specloom";

export interface FieldDisplayProps {
  field: ShowFieldVM | ListFieldVM;
  value: unknown;
  class?: string;
}

export const FieldDisplay: Component<FieldDisplayProps> = (props) => {
  const formatted = () => Format.field(props.value, props.field);

  return (
    <Switch fallback={<span class={props.class}>{formatted()}</span>}>
      <Match when={props.field.kind === "boolean"}>
        <span class={`text-muted-foreground ${props.class ?? ""}`}>
          {props.value ? "✓" : "✗"}
        </span>
      </Match>
      <Match when={props.field.kind === "relation" && props.field.relation}>
        <span class={`text-primary ${props.class ?? ""}`}>
          {formatted()}
        </span>
      </Match>
    </Switch>
  );
};
