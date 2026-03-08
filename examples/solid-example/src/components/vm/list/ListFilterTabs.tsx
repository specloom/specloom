import { For, Show } from "solid-js";
import type { Accessor } from "solid-js";
import type { ListVM } from "specloom";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface ListFilterTabsProps {
  vm: Accessor<ListVM>;
  activeFilterId: Accessor<string | null>;
  onFilterChange: (filterId: string | null) => void;
}

export function ListFilterTabs(props: ListFilterTabsProps) {
  return (
    <Show when={props.vm().hasFilters}>
      <Tabs
        value={props.activeFilterId() ?? "__all__"}
        onChange={(value) => props.onFilterChange(value === "__all__" ? null : value)}
      >
        <TabsList>
          <TabsTrigger value="__all__">すべて</TabsTrigger>
          <For each={props.vm().filters}>
            {(filter) => (
              <TabsTrigger value={filter.id}>{filter.label}</TabsTrigger>
            )}
          </For>
        </TabsList>
      </Tabs>
    </Show>
  );
}
