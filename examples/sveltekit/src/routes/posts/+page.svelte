<script lang="ts">
  import { ListView, ShowView, FormView } from "@specloom/svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";
  import { postsListVM, postsShowVM, postsFormVM } from "$lib/data/posts";

  type View = "list" | "show" | "form";

  let currentView = $state<View>("list");
  let listVM = $state<ListViewModel>(postsListVM);
  let showVM = $state<ShowViewModel>(postsShowVM);
  let formVM = $state<FormViewModel>(postsFormVM);

  function handleSelect(rowId: string) {
    const selected = listVM.selection.selected.includes(rowId)
      ? listVM.selection.selected.filter((id) => id !== rowId)
      : [...listVM.selection.selected, rowId];
    listVM = { ...listVM, selection: { ...listVM.selection, selected } };
  }

  function handleSelectAll() {
    const allSelected = listVM.selection.selected.length === listVM.rows.length;
    listVM = {
      ...listVM,
      selection: {
        ...listVM.selection,
        selected: allSelected ? [] : listVM.rows.map((r) => r.id),
      },
    };
  }

  function handleListAction(actionId: string, rowIds?: string[]) {
    if (actionId === "create" || actionId === "edit") {
      currentView = "form";
    }
  }

  function handleShowAction(actionId: string) {
    if (actionId === "edit") {
      currentView = "form";
    }
  }

  function handleFormAction(actionId: string) {
    if (actionId === "cancel") {
      currentView = "list";
    }
  }

  function handleFormChange(name: string, value: unknown) {
    formVM = {
      ...formVM,
      isDirty: true,
      fields: formVM.fields.map((f) => (f.name === name ? { ...f, value } : f)),
    };
  }

  function handleFormSubmit() {
    currentView = "list";
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-semibold text-foreground">投稿管理</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        ブログ記事の作成・編集を行います
      </p>
    </div>
    {#if currentView !== "list"}
      <button
        onclick={() => (currentView = "list")}
        class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <ArrowLeft class="h-4 w-4" />
        一覧に戻る
      </button>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
    {#if currentView === "list"}
      <ListView
        vm={listVM}
        onAction={handleListAction}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onRowClick={() => (currentView = "show")}
      />
    {:else if currentView === "show"}
      <ShowView vm={showVM} onAction={handleShowAction} />
    {:else if currentView === "form"}
      <FormView
        vm={formVM}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        onAction={handleFormAction}
      />
    {/if}
  </div>
</div>
