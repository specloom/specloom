import { createContext, useContext, type Accessor, type JSX } from "solid-js";
import type { ShowViewModel, ShowFieldVM, ActionVM, FieldGroup } from "specloom";
import { ShowVM } from "specloom";

export interface ShowContextValue {
  // ViewModel
  vm: Accessor<ShowViewModel>;

  // Callbacks
  onAction?: (actionId: string) => void;

  // Derived values
  fields: Accessor<ShowFieldVM[]>;
  groups: Accessor<FieldGroup[]>;
  actions: Accessor<ActionVM[]>;
  allowedActions: Accessor<ActionVM[]>;
  loading: Accessor<boolean>;
  error: Accessor<string | undefined>;
  label: Accessor<string>;
  id: Accessor<string>;
}

const ShowContext = createContext<ShowContextValue>();

export interface ShowProviderProps {
  vm: ShowViewModel;
  onAction?: (actionId: string) => void;
  children: JSX.Element;
}

export function ShowProvider(props: ShowProviderProps) {
  const vm = () => props.vm;

  const value: ShowContextValue = {
    vm,
    onAction: props.onAction,

    // Derived
    fields: () => ShowVM.fields(vm()),
    groups: () => ShowVM.groups(vm()),
    actions: () => vm().actions,
    allowedActions: () => ShowVM.allowedActions(vm()),
    loading: () => ShowVM.loading(vm()),
    error: () => ShowVM.error(vm()),
    label: () => ShowVM.label(vm()),
    id: () => vm().id,
  };

  return (
    <ShowContext.Provider value={value}>{props.children}</ShowContext.Provider>
  );
}

export function useShow(): ShowContextValue {
  const context = useContext(ShowContext);
  if (!context) {
    throw new Error("useShow must be used within a ShowView");
  }
  return context;
}
