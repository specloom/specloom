import { createSignal } from "solid-js";
import { ListView, FormView, ShowView } from "@specloom/solidjs";
import { sampleListVM, sampleFormVM, sampleShowVM } from "./sampleData.js";

type ViewType = "list" | "form" | "show";

export default function App() {
  const [currentView, setCurrentView] = createSignal<ViewType>("list");

  const handleAction = (actionId: string, rowId?: string) => {
    console.log("Action:", actionId, "Row:", rowId);

    // Navigate based on action
    if (actionId === "edit" || actionId === "create") {
      setCurrentView("form");
    } else if (actionId === "back" || actionId === "cancel") {
      setCurrentView("list");
    } else if (actionId === "save") {
      setCurrentView("show");
    }
  };

  const handleRowClick = (rowId: string) => {
    console.log("Row clicked:", rowId);
    setCurrentView("show");
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    console.log("Field changed:", fieldName, "=", value);
  };

  return (
    <div style={{ padding: "20px", "max-width": "1200px", margin: "0 auto" }}>
      {/* Navigation */}
      <nav style={{ "margin-bottom": "20px", display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={() => setCurrentView("list")}
          style={{ "font-weight": currentView() === "list" ? "bold" : "normal" }}
        >
          ListView
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("form")}
          style={{ "font-weight": currentView() === "form" ? "bold" : "normal" }}
        >
          FormView
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("show")}
          style={{ "font-weight": currentView() === "show" ? "bold" : "normal" }}
        >
          ShowView
        </button>
      </nav>

      <hr style={{ "margin-bottom": "20px" }} />

      {/* View Content */}
      {currentView() === "list" && (
        <ListView
          vm={sampleListVM}
          onAction={handleAction}
          onRowClick={handleRowClick}
          onSort={(field, order) => console.log("Sort:", field, order)}
          onSearch={(query) => console.log("Search:", query)}
          onFilterChange={(id, active) => console.log("Filter:", id, active)}
          onSelectionChange={(ids) => console.log("Selection:", ids)}
        />
      )}

      {currentView() === "form" && (
        <FormView
          vm={sampleFormVM}
          onAction={handleAction}
          onFieldChange={handleFieldChange}
          onSubmit={() => console.log("Submit")}
        />
      )}

      {currentView() === "show" && (
        <ShowView
          vm={sampleShowVM}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
