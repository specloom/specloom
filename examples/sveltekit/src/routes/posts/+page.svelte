<script lang="ts">
  import { ListView, ShowView, FormView } from "@specloom/svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import type { ListViewModel, ShowViewModel, FormViewModel, Context } from "specloom";
  import { evaluateListView, evaluateShowView, evaluateFormView } from "specloom";
  import { getResource, getListView, getShowView, getFormView } from "$lib/admin";
  import { samplePosts } from "$lib/data/sample-posts";

  // リソースとビューを取得
  const resource = getResource("Post")!;
  const listViewSpec = getListView("Post")!;
  const showViewSpec = getShowView("Post")!;
  const formViewSpec = getFormView("Post")!;

  // ユーザーコンテキスト（実際のアプリではログインユーザー情報から取得）
  const context: Context = {
    user: { id: "1", name: "田中太郎" },
    role: "admin",
    permissions: ["post:read", "post:write", "post:delete"],
    custom: {},
  };

  type View = "list" | "show" | "form";

  let currentView = $state<View>("list");
  let currentPostId = $state<string | null>(null);
  let formMode = $state<"create" | "edit">("create");
  let selectedIds = $state<string[]>([]);
  let searchQuery = $state<string>("");

  // データを Record<string, unknown>[] に変換
  const postsData = samplePosts.map((p) => ({
    ...p,
    author: p.author.name, // relation は表示用に name を使用
    tags: p.tags.map((t) => t.name).join(", "),
  }));

  // ListViewModel を評価
  let listVM = $derived<ListViewModel>(
    evaluateListView({
      view: listViewSpec,
      resource,
      context,
      data: postsData,
      selected: selectedIds,
      searchQuery,
    })
  );

  // ShowViewModel を評価
  let showVM = $derived<ShowViewModel>(() => {
    const post = postsData.find((p) => p.id === currentPostId);
    if (!post) {
      return evaluateShowView({
        view: showViewSpec,
        resource,
        context,
        data: postsData[0],
      });
    }
    return evaluateShowView({
      view: showViewSpec,
      resource,
      context,
      data: post,
    });
  });

  // FormViewModel を評価
  let formVM = $derived<FormViewModel>(() => {
    const post = formMode === "edit"
      ? postsData.find((p) => p.id === currentPostId)
      : undefined;
    return evaluateFormView({
      view: formViewSpec,
      resource,
      context,
      data: post,
      mode: formMode,
    });
  });

  function handleSelect(rowId: string) {
    selectedIds = selectedIds.includes(rowId)
      ? selectedIds.filter((id) => id !== rowId)
      : [...selectedIds, rowId];
  }

  function handleSelectAll() {
    const allSelected = selectedIds.length === listVM.rows.length;
    selectedIds = allSelected ? [] : listVM.rows.map((r) => r.id);
  }

  function handleListAction(actionId: string, rowIds?: string[]) {
    if (actionId === "create") {
      formMode = "create";
      currentPostId = null;
      currentView = "form";
    } else if (actionId === "edit" && rowIds?.[0]) {
      formMode = "edit";
      currentPostId = rowIds[0];
      currentView = "form";
    }
  }

  function handleShowAction(actionId: string) {
    if (actionId === "edit") {
      formMode = "edit";
      currentView = "form";
    }
  }

  function handleFormAction(actionId: string) {
    if (actionId === "cancel") {
      currentView = "list";
    } else if (actionId === "save") {
      // 保存処理（実際のアプリではAPIを呼び出す）
      currentView = "list";
    }
  }

  function handleRowClick(rowId: string) {
    currentPostId = rowId;
    currentView = "show";
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-semibold text-foreground">投稿管理</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        ブログ記事の作成・編集を行います（TypeSpecから生成）
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
        onRowClick={handleRowClick}
      />
    {:else if currentView === "show"}
      <ShowView vm={showVM()} onAction={handleShowAction} />
    {:else if currentView === "form"}
      <FormView
        vm={formVM()}
        onAction={handleFormAction}
      />
    {/if}
  </div>
</div>
