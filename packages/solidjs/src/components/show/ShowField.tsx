import { type Component } from "solid-js";
import type { ShowFieldVM } from "specloom";
import { FieldDisplay } from "../shared/FieldDisplay.jsx";

export interface ShowFieldProps {
  field: ShowFieldVM;
  value: unknown;
  class?: string;
}

/**
 * ShowField - 詳細ビューの単一フィールド表示
 */
export const ShowField: Component<ShowFieldProps> = (props) => {
  return (
    <div class={props.class ?? "flex flex-col gap-1"}>
      <dt class="text-sm font-medium text-muted-foreground">
        {props.field.label}
      </dt>
      <dd class="text-base text-foreground">
        <FieldDisplay field={props.field} value={props.value} />
      </dd>
    </div>
  );
};
