// @specloom/solidjs
// SolidJS components for specloom ViewModel

// Components
export { ActionButton } from "./components/ActionButton.js";
export type { ActionButtonProps } from "./components/ActionButton.js";

export { FieldDisplay } from "./components/FieldDisplay.js";
export type { FieldDisplayProps } from "./components/FieldDisplay.js";

export { FieldInput } from "./components/FieldInput.js";
export type { FieldInputProps } from "./components/FieldInput.js";

export { ListView } from "./components/ListView.js";
export type { ListViewProps } from "./components/ListView.js";

export { ShowView } from "./components/ShowView.js";
export type { ShowViewProps } from "./components/ShowView.js";

export { FormView } from "./components/FormView.js";
export type { FormViewProps } from "./components/FormView.js";

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
