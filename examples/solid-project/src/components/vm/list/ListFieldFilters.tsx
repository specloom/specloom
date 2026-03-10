import type { ListFilterVM } from "specloom";
import { useI18n } from "@specloom/solidjs";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { Button } from "~/components/ui/button";

type FilterValue = string;

function fieldInputType(
  filter: ListFilterVM,
): "text" | "select" | "boolean" | "date" | "date-range" {
  if (filter.widget === "date-range") return "date-range";

  if (filter.fieldSpec.options && filter.fieldSpec.options.length > 0)
    return "select";

  const type = filter.fieldSpec.type;
  const typeName =
    type.kind === "scalar" || type.kind === "enum" ? type.name : undefined;
  if (typeName === "boolean") return "boolean";
  if (
    typeName === "date" ||
    typeName === "datetime" ||
    typeName === "utcDateTime"
  )
    return "date-range";
  return "text";
}

const inputClass =
  "flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function ListFieldFilters(props: {
  filters: ListFilterVM[];
  onSearch: (filters: Record<string, FilterValue>) => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = createSignal<Record<string, FilterValue>>({});

  const updateDraft = (field: string, value: string) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSearch = () => props.onSearch(draft());

  const handleReset = () => {
    setDraft({});
    props.onSearch({});
  };

  const hasInput = () => Object.values(draft()).some((v) => v.trim() !== "");

  return (
    <Show when={props.filters.length > 0}>
      <div class="mb-4 flex flex-wrap items-end gap-2">
        <For each={props.filters}>
          {(filter) => {
            const type = fieldInputType(filter);
            return (
              <Switch>
                <Match when={type === "select"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {filter.label}
                    </label>
                    <select
                      value={draft()[filter.field] ?? ""}
                      onChange={(e) =>
                        updateDraft(filter.field, e.currentTarget.value)
                      }
                      class={inputClass}
                    >
                      <option value="">--</option>
                      <For each={filter.fieldSpec.options}>
                        {(opt) => (
                          <option value={String(opt.value)}>{opt.label}</option>
                        )}
                      </For>
                    </select>
                  </div>
                </Match>
                <Match when={type === "boolean"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {filter.label}
                    </label>
                    <select
                      value={draft()[filter.field] ?? ""}
                      onChange={(e) =>
                        updateDraft(filter.field, e.currentTarget.value)
                      }
                      class={inputClass}
                    >
                      <option value="">--</option>
                      <option value="true">{filter.label}</option>
                      <option value="false">Not {filter.label}</option>
                    </select>
                  </div>
                </Match>
                <Match when={type === "date-range"}>
                  <div class="flex gap-1">
                    <div class="w-40">
                      <label class="mb-1 block text-xs text-muted-foreground">
                        {filter.label} (from)
                      </label>
                      <input
                        type="date"
                        value={draft()[`${filter.field}__gte`] ?? ""}
                        onInput={(e) =>
                          updateDraft(
                            `${filter.field}__gte`,
                            e.currentTarget.value,
                          )
                        }
                        class={inputClass}
                      />
                    </div>
                    <div class="w-40">
                      <label class="mb-1 block text-xs text-muted-foreground">
                        {filter.label} (to)
                      </label>
                      <input
                        type="date"
                        value={draft()[`${filter.field}__lte`] ?? ""}
                        onInput={(e) =>
                          updateDraft(
                            `${filter.field}__lte`,
                            e.currentTarget.value,
                          )
                        }
                        class={inputClass}
                      />
                    </div>
                  </div>
                </Match>
                <Match when={type === "date"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {filter.label}
                    </label>
                    <input
                      type="date"
                      value={draft()[filter.field] ?? ""}
                      onInput={(e) =>
                        updateDraft(filter.field, e.currentTarget.value)
                      }
                      class={inputClass}
                    />
                  </div>
                </Match>
                <Match when={type === "text"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {filter.label}
                    </label>
                    <input
                      type="text"
                      value={draft()[filter.field] ?? ""}
                      onInput={(e) =>
                        updateDraft(filter.field, e.currentTarget.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder={filter.label}
                      class={inputClass}
                    />
                  </div>
                </Match>
              </Switch>
            );
          }}
        </For>
        <div class="flex gap-1">
          <Button size="sm" onClick={handleSearch}>
            {t("list.searchPlaceholder")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={!hasInput()}
          >
            {t("list.filterAll")}
          </Button>
        </div>
      </div>
    </Show>
  );
}
