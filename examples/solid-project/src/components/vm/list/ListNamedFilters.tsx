import type { NamedFilterVM } from "specloom";
import { useI18n } from "@specloom/solidjs";
import { For, Show } from "solid-js";
import { Button } from "~/components/ui/button";

export function ListNamedFilters(props: {
  filters: NamedFilterVM[];
  onSelect: (id: string | null) => void;
}) {
  const { t } = useI18n();

  return (
    <Show when={props.filters.length > 0}>
      <div class="mb-4 flex gap-2">
        <Button
          variant={
            props.filters.every((f) => !f.active) ? "default" : "outline"
          }
          size="sm"
          onClick={() => props.onSelect(null)}
        >
          {t("list.filterAll")}
        </Button>
        <For each={props.filters}>
          {(filter) => (
            <Button
              variant={filter.active ? "default" : "outline"}
              size="sm"
              onClick={() =>
                props.onSelect(filter.active ? null : filter.id)
              }
            >
              {filter.label}
            </Button>
          )}
        </For>
      </div>
    </Show>
  );
}
