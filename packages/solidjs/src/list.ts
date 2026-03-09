import type { CompiledResource, CompiledSpec } from "@specloom/spec";
import {
  createListState,
  type Context,
  type CreateListStateArgs,
  type ListState,
  type ListStateSnapshot,
  type ListViewModel,
} from "specloom";
import { createMemo, createSignal, type Accessor } from "solid-js";
import { resolveResource, type SpecloomRuntime } from "./client.js";
import { useSpecloom } from "./context.js";

export interface SolidListStore {
  state: Accessor<ListState>;
  snapshot: Accessor<ListStateSnapshot>;
  view: Accessor<ListViewModel>;
  setData(data: Record<string, unknown>[]): void;
  setSearch(query: string): void;
  setNamedFilter(id: string | null): void;
  setSort(field: string, direction: "asc" | "desc"): void;
  toggleSelect(id: string): void;
  select(ids: string[]): void;
  clearSelection(): void;
}

export interface CreateSolidListStoreArgs
  extends Omit<CreateListStateArgs, "context" | "resource"> {
  resource: CompiledResource | string;
  spec?: CompiledSpec;
  runtime?: SpecloomRuntime;
  context?: Context;
}

export function createListStore(args: CreateSolidListStoreArgs): SolidListStore {
  const resource = resolveResource(args.resource, args.spec, args.runtime);
  const [state, setState] = createSignal(
    createListState({
      resource,
      context: resolveContext(args.runtime, args.context),
      data: args.data,
      searchQuery: args.searchQuery,
      activeFilter: args.activeFilter,
      selected: args.selected,
      sort: args.sort,
    }),
  );
  const snapshot = createMemo(() => state().snapshot());
  const view = createMemo(() => state().view());

  function update(next: ListState) {
    setState(() => next);
  }

  return {
    state,
    snapshot,
    view,
    setData(data) {
      update(state().setData(data));
    },
    setSearch(query) {
      update(state().setSearch(query));
    },
    setNamedFilter(id) {
      update(state().setNamedFilter(id));
    },
    setSort(field, direction) {
      update(state().setSort(field, direction));
    },
    toggleSelect(id) {
      update(state().toggleSelect(id));
    },
    select(ids) {
      update(state().select(ids));
    },
    clearSelection() {
      update(state().clearSelection());
    },
  };
}

export function useListStore(
  args: Omit<CreateSolidListStoreArgs, "runtime">,
): SolidListStore {
  return createListStore({
    ...args,
    runtime: useSpecloom(),
  });
}

function resolveContext(runtime?: SpecloomRuntime, context?: Context): Context {
  if (!runtime) {
    return context ?? {};
  }
  return runtime.resolveContext(context);
}
