import { createSignal } from "solid-js";
import { ListView, ShowView, FormView } from "@specloom/solidjs";
import type { ListViewModel, ShowViewModel, FormViewModel } from "specloom";
import { usersListVM, usersShowVM, usersFormVM } from "./data";

type View = "list" | "show" | "form";

export function App() {
  const [currentView, setCurrentView] = createSignal<View>("list");
  const [listVM, setListVM] = createSignal<ListViewModel>(usersListVM);
  const [showVM] = createSignal<ShowViewModel>(usersShowVM);
  const [formVM, setFormVM] = createSignal<FormViewModel>(usersFormVM);

  // 選択状態の更新
  const handleSelect = (rowId: string) => {
    setListVM((prev) => {
      const selected = prev.selection.selected.includes(rowId)
        ? prev.selection.selected.filter((id) => id !== rowId)
        : [...prev.selection.selected, rowId];
      return { ...prev, selection: { ...prev.selection, selected } };
    });
  };

  // 全選択/解除
  const handleSelectAll = () => {
    setListVM((prev) => {
      const allSelected = prev.selection.selected.length === prev.rows.length;
      const selected = allSelected ? [] : prev.rows.map((r) => r.id);
      return { ...prev, selection: { ...prev.selection, selected } };
    });
  };

  // アクション実行
  const handleListAction = (actionId: string, rowIds?: string[]) => {
    console.log("List action:", actionId, rowIds);
    if (actionId === "create") {
      setCurrentView("form");
    } else if (actionId === "edit" && rowIds?.[0]) {
      setCurrentView("form");
    }
  };

  const handleShowAction = (actionId: string) => {
    console.log("Show action:", actionId);
    if (actionId === "edit") {
      setCurrentView("form");
    } else if (actionId === "back") {
      setCurrentView("list");
    }
  };

  const handleFormAction = (actionId: string) => {
    console.log("Form action:", actionId);
    if (actionId === "cancel") {
      setCurrentView("list");
    }
  };

  // フォーム値変更
  const handleFormChange = (name: string, value: unknown) => {
    setFormVM((prev) => ({
      ...prev,
      isDirty: true,
      fields: prev.fields.map((f) => (f.name === name ? { ...f, value } : f)),
    }));
  };

  // フォーム送信
  const handleFormSubmit = () => {
    console.log(
      "Form submitted:",
      formVM().fields.map((f) => ({ [f.name]: f.value })),
    );
    setCurrentView("list");
  };

  // 行クリック
  const handleRowClick = (rowId: string) => {
    console.log("Row clicked:", rowId);
    setCurrentView("show");
  };

  return (
    <div style={{ "max-width": "1200px", margin: "0 auto", padding: "24px" }}>
      {/* Navigation */}
      <nav style={{ "margin-bottom": "24px", display: "flex", gap: "8px" }}>
        <button
          onClick={() => setCurrentView("list")}
          style={{
            padding: "8px 16px",
            background: currentView() === "list" ? "#3b82f6" : "#e5e7eb",
            color: currentView() === "list" ? "white" : "black",
            border: "none",
            "border-radius": "6px",
            cursor: "pointer",
          }}
        >
          一覧
        </button>
        <button
          onClick={() => setCurrentView("show")}
          style={{
            padding: "8px 16px",
            background: currentView() === "show" ? "#3b82f6" : "#e5e7eb",
            color: currentView() === "show" ? "white" : "black",
            border: "none",
            "border-radius": "6px",
            cursor: "pointer",
          }}
        >
          詳細
        </button>
        <button
          onClick={() => setCurrentView("form")}
          style={{
            padding: "8px 16px",
            background: currentView() === "form" ? "#3b82f6" : "#e5e7eb",
            color: currentView() === "form" ? "white" : "black",
            border: "none",
            "border-radius": "6px",
            cursor: "pointer",
          }}
        >
          フォーム
        </button>
      </nav>

      {/* Views */}
      {currentView() === "list" && (
        <ListView
          vm={listVM()}
          onAction={handleListAction}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onRowClick={handleRowClick}
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
  );
}
