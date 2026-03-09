import { useI18n } from "@specloom/solidjs";
import { createSignal, Show } from "solid-js";

export function ListSearch(props: {
  fields: string[];
  initialQuery: string;
  onSearch: (query: string) => void;
}) {
  const { t } = useI18n();
  const [query, setQuery] = createSignal(props.initialQuery);

  return (
    <Show when={props.fields.length > 0}>
      <div class="mb-4 max-w-sm">
        <input
          value={query()}
          onInput={(e) => {
            const v = e.currentTarget.value;
            setQuery(v);
            props.onSearch(v);
          }}
          placeholder={t("list.searchPlaceholder")}
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
    </Show>
  );
}
