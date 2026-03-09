import type { ListColumnVM } from "specloom";
import { useI18n } from "@specloom/solidjs";
import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js";
import { Button } from "~/components/ui/button";

type FilterValue = string;

function fieldInputType(col: ListColumnVM): "text" | "select" | "boolean" | "date" | "date-range" {
  const filter = col.fieldSpec.filter;
  if (!filter) return "text";

  if (filter.widget === "date-range") return "date-range";

  if (col.fieldSpec.options && col.fieldSpec.options.length > 0) return "select";

  const type = col.fieldSpec.type;
  const typeName = (type.kind === "scalar" || type.kind === "enum") ? type.name : undefined;
  if (typeName === "boolean") return "boolean";
  if (typeName === "date" || typeName === "datetime" || typeName === "utcDateTime") return "date-range";
  return "text";
}

const inputClass =
  "flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function ListFieldFilters(props: {
  columns: ListColumnVM[];
  onSearch: (filters: Record<string, FilterValue>) => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = createSignal<Record<string, FilterValue>>({});

  const filterableColumns = createMemo(() =>
    props.columns.filter((col) => col.fieldSpec.filter),
  );

  const updateDraft = (field: string, value: string) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSearch = () => props.onSearch(draft());

  const handleReset = () => {
    setDraft({});
    props.onSearch({});
  };

  const hasInput = () =>
    Object.values(draft()).some((v) => v.trim() !== "");

  return (
    <Show when={filterableColumns().length > 0}>
      <div class="mb-4 flex flex-wrap items-end gap-2">
        <For each={filterableColumns()}>
          {(col) => {
            const type = fieldInputType(col);
            return (
              <Switch>
                <Match when={type === "select"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {col.label}
                    </label>
                    <select
                      value={draft()[col.field] ?? ""}
                      onChange={(e) => updateDraft(col.field, e.currentTarget.value)}
                      class={inputClass}
                    >
                      <option value="">--</option>
                      <For each={col.fieldSpec.options}>
                        {(opt) => <option value={String(opt.value)}>{opt.label}</option>}
                      </For>
                    </select>
                  </div>
                </Match>
                <Match when={type === "boolean"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {col.label}
                    </label>
                    <select
                      value={draft()[col.field] ?? ""}
                      onChange={(e) => updateDraft(col.field, e.currentTarget.value)}
                      class={inputClass}
                    >
                      <option value="">--</option>
                      <option value="true">{col.label}</option>
                      <option value="false">Not {col.label}</option>
                    </select>
                  </div>
                </Match>
                <Match when={type === "date-range"}>
                  <div class="flex gap-1">
                    <div class="w-40">
                      <label class="mb-1 block text-xs text-muted-foreground">
                        {col.label} (from)
                      </label>
                      <input
                        type="date"
                        value={draft()[`${col.field}__gte`] ?? ""}
                        onInput={(e) => updateDraft(`${col.field}__gte`, e.currentTarget.value)}
                        class={inputClass}
                      />
                    </div>
                    <div class="w-40">
                      <label class="mb-1 block text-xs text-muted-foreground">
                        {col.label} (to)
                      </label>
                      <input
                        type="date"
                        value={draft()[`${col.field}__lte`] ?? ""}
                        onInput={(e) => updateDraft(`${col.field}__lte`, e.currentTarget.value)}
                        class={inputClass}
                      />
                    </div>
                  </div>
                </Match>
                <Match when={type === "date"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {col.label}
                    </label>
                    <input
                      type="date"
                      value={draft()[col.field] ?? ""}
                      onInput={(e) => updateDraft(col.field, e.currentTarget.value)}
                      class={inputClass}
                    />
                  </div>
                </Match>
                <Match when={type === "text"}>
                  <div class="w-40">
                    <label class="mb-1 block text-xs text-muted-foreground">
                      {col.label}
                    </label>
                    <input
                      type="text"
                      value={draft()[col.field] ?? ""}
                      onInput={(e) => updateDraft(col.field, e.currentTarget.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder={col.label}
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
          <Button size="sm" variant="outline" onClick={handleReset} disabled={!hasInput()}>
            {t("list.filterAll")}
          </Button>
        </div>
      </div>
    </Show>
  );
}
