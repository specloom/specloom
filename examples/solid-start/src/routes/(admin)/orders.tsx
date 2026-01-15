import { createSignal } from "solid-js";
import { List, Show, Form, Button } from "@specloom/solidjs2";
import { ArrowLeft } from "lucide-solid";
import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";
import { ordersListVM, ordersShowVM, ordersFormVM } from "~/data/orders";

type View = "list" | "show" | "form";

export default function OrdersPage() {
  const [currentView, setCurrentView] = createSignal<View>("list");
  const [listVM, setListVM] = createSignal<ListViewModel>(ordersListVM);
  const [showVM] = createSignal<ShowViewModel>(ordersShowVM);
  const [formVM, setFormVM] = createSignal<FormViewModel>(ordersFormVM);

  // 単一選択モード
  const handleSelect = (rowId: string) => {
    setListVM((prev) => ({
      ...prev,
      selection: { ...prev.selection, selected: [rowId] },
    }));
  };

  const handleListAction = (actionId: string, rowIds?: string[]) => {
    console.log("List action:", actionId, rowIds);
    if (actionId === "view") setCurrentView("show");
  };

  const handleShowAction = (actionId: string) => {
    console.log("Show action:", actionId);
    if (actionId === "edit") setCurrentView("form");
  };

  const handleFormAction = (actionId: string) => {
    if (actionId === "cancel") setCurrentView("list");
  };

  const handleFormChange = (name: string, value: unknown) => {
    setFormVM((prev) => ({
      ...prev,
      isDirty: true,
      fields: prev.fields.map((f) => (f.name === name ? { ...f, value } : f)),
    }));
  };

  const handleFormSubmit = () => {
    console.log("Form submitted");
    setCurrentView("list");
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-foreground">注文管理</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            注文の一覧と詳細を管理します
          </p>
        </div>
        {currentView() !== "list" && (
          <Button
            onClick={() => setCurrentView("list")}
            variant="outline"
            size="sm"
            class="gap-2"
          >
            <ArrowLeft class="h-4 w-4" />
            一覧に戻る
          </Button>
        )}
      </div>

      <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        {currentView() === "list" && (
          <List
            vm={listVM()}
            onAction={handleListAction}
            onSelect={handleSelect}
            onRowClick={() => setCurrentView("show")}
          />
        )}
        {currentView() === "show" && (
          <Show vm={showVM()} onAction={handleShowAction} />
        )}
        {currentView() === "form" && (
          <Form
            vm={formVM()}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            onAction={handleFormAction}
          />
        )}
      </div>
    </div>
  );
}
