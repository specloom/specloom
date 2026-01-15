// @specloom/solidjs
// SolidJS components for specloom ViewModel

// Re-export ViewModel types from specloom
export type {
  ViewModel,
  ListViewModel,
  ShowViewModel,
  FormViewModel,
  ListFieldVM,
  ShowFieldVM,
  FormFieldVM,
  ActionVM,
  RowVM,
} from "specloom";

// Components
export { ListView } from "./components/ListView.tsx";
export type { ListViewProps } from "./components/ListView.tsx";

export { ShowView } from "./components/ShowView.tsx";
export type { ShowViewProps } from "./components/ShowView.tsx";

export { FormView } from "./components/FormView.tsx";
export type { FormViewProps } from "./components/FormView.tsx";

export { FieldRenderer } from "./components/FieldRenderer.tsx";
export type { FieldRendererProps } from "./components/FieldRenderer.tsx";

export { ActionButton } from "./components/ActionButton.tsx";
export type { ActionButtonProps } from "./components/ActionButton.tsx";
