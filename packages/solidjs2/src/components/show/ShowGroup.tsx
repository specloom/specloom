import { type Component, For, Show } from "solid-js";
import type { ShowFieldVM, ShowViewModel, FieldGroup } from "specloom";
import { ShowVM } from "specloom";
import { ShowField } from "./ShowField.jsx";

export interface ShowGroupProps {
  group?: FieldGroup;
  fields: ShowFieldVM[];
  vm: ShowViewModel;
}

export const ShowGroup: Component<ShowGroupProps> = (props) => {
  return (
    <div class="rounded-lg border border-border p-4">
      <Show when={props.group}>
        <h3 class="mb-4 text-lg font-semibold text-foreground">
          {props.group!.label}
        </h3>
      </Show>

      <dl class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <For each={props.fields}>
          {(field) => (
            <ShowField
              field={field}
              value={ShowVM.value(props.vm, field.name)}
            />
          )}
        </For>
      </dl>
    </div>
  );
};
