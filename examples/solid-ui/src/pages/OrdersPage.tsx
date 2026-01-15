import { createSignal } from "solid-js";
import { ListView, ShowView, FormView } from "@specloom/solidjs";
import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";
import { ordersListVM, ordersShowVM, ordersFormVM } from "../data";

type View = "list" | "show" | "form";

export function OrdersPage() {
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
    console.log("Orders list action:", actionId, rowIds);
    if (actionId === "view") setCurrentView("show");
  };

  const handleShowAction = (actionId: string) => {
    console.log("Orders show action:", actionId);
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
    console.log("Orders form submitted");
    setCurrentView("list");
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">注文管理</h1>
          <p class="mt-1 text-sm text-gray-500">注文の一覧と詳細を管理します</p>
        </div>
        {currentView() !== "list" && (
          <button
            onClick={() => setCurrentView("list")}
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            一覧に戻る
          </button>
        )}
      </div>

      <div class="bg-white shadow rounded-lg overflow-hidden">
        {currentView() === "list" && (
          <ListView
            vm={listVM()}
            onAction={handleListAction}
            onSelect={handleSelect}
            onRowClick={() => setCurrentView("show")}
          />
        )}
        {currentView() === "show" && (
          <ShowView vm={showVM()} onAction={handleShowAction} />
        )}
        {currentView() === "form" && (
          <FormView
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
