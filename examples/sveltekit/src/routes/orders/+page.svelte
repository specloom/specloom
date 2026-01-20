<script lang="ts">
  import { ListView, ShowView, FormView } from "@specloom/svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";
  import { ordersListVM, ordersShowVM, ordersFormVM } from "$lib/data/orders";

  type View = "list" | "show" | "form";

  let currentView = $state<View>("list");
  let listVM = $state<ListViewModel>(ordersListVM);
  let showVM = $state<ShowViewModel>(ordersShowVM);
  let formVM = $state<FormViewModel>(ordersFormVM);

  // 単一選択モード
  function handleSelect(rowId: string) {
    listVM = {
      ...listVM,
      selection: { ...listVM.selection, selected: [rowId] },
    };
  }

  function handleListAction(actionId: string, rowIds?: string[]) {
    if (actionId === "view") {
      currentView = "show";
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
      <h1 class="text-2xl font-semibold text-foreground">注文管理</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        注文の一覧と詳細を管理します
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
