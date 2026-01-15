import { createSignal, Show } from "solid-js";
import { ListView, ShowView, FormView } from "@specloom/solidjs";
import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";
import { usersListVM, usersShowVM, usersFormVM } from "../data";

type View = "list" | "show" | "form";

export function UsersPage() {
  const [currentView, setCurrentView] = createSignal<View>("list");
  const [listVM, setListVM] = createSignal<ListViewModel>(usersListVM);
  const [showVM] = createSignal<ShowViewModel>(usersShowVM);
  const [formVM, setFormVM] = createSignal<FormViewModel>(usersFormVM);

  const handleSelect = (rowId: string) => {
    setListVM((prev) => {
      const selected = prev.selection.selected.includes(rowId)
        ? prev.selection.selected.filter((id) => id !== rowId)
        : [...prev.selection.selected, rowId];
      return { ...prev, selection: { ...prev.selection, selected } };
    });
  };

  const handleSelectAll = () => {
    setListVM((prev) => {
      const allSelected = prev.selection.selected.length === prev.rows.length;
      return {
        ...prev,
        selection: {
          ...prev.selection,
          selected: allSelected ? [] : prev.rows.map((r) => r.id),
        },
      };
    });
  };

  const handleListAction = (actionId: string, rowIds?: string[]) => {
    console.log("Users list action:", actionId, rowIds);
    if (actionId === "create" || actionId === "edit") setCurrentView("form");
  };

  const handleShowAction = (actionId: string) => {
    console.log("Users show action:", actionId);
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
    console.log("Users form submitted");
    setCurrentView("list");
  };

  return (
    <div class="space-y-4">
      <Show when={currentView() !== "list"}>
        <button
          onClick={() => setCurrentView("list")}
          class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <span>←</span> 一覧に戻る
        </button>
      </Show>

      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        {currentView() === "list" && (
          <ListView
            vm={listVM()}
            onAction={handleListAction}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
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
