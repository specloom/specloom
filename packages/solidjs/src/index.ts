// @specloom/solidjs
// SolidJS components for specloom ViewModel

// Components
export { ActionButton } from "./components/ActionButton.jsx";
export type { ActionButtonProps } from "./components/ActionButton.jsx";

export { FieldDisplay } from "./components/FieldDisplay.jsx";
export type { FieldDisplayProps } from "./components/FieldDisplay.jsx";

export { FieldInput } from "./components/FieldInput.jsx";
export type { FieldInputProps } from "./components/FieldInput.jsx";

export { ListView } from "./components/ListView.jsx";
export type { ListViewProps } from "./components/ListView.jsx";

export { ShowView } from "./components/ShowView.jsx";
export type { ShowViewProps } from "./components/ShowView.jsx";

export { FormView } from "./components/FormView.jsx";
export type { FormViewProps } from "./components/FormView.jsx";

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

// Re-export VM helpers for advanced usage
export {
  ListVM,
  ShowVM,
  FormVM,
  ActionVMHelper,
  Format,
  createI18n,
} from "specloom";
