import { createContext, useContext, type Accessor, type JSX } from "solid-js";
import type {
  FormViewModel,
  FormFieldVM,
  ActionVM,
  FieldGroup,
} from "specloom";
import { FormVM } from "specloom";

export interface FormContextValue {
  // ViewModel
  vm: Accessor<FormViewModel>;

  // Callbacks
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;

  // Derived values
  fields: Accessor<FormFieldVM[]>;
  visibleFields: Accessor<FormFieldVM[]>;
  groups: Accessor<FieldGroup[]>;
  actions: Accessor<ActionVM[]>;
  allowedActions: Accessor<ActionVM[]>;
  values: Accessor<Record<string, unknown>>;
  isValid: Accessor<boolean>;
  isDirty: Accessor<boolean>;
  canSubmit: Accessor<boolean>;
  loading: Accessor<boolean>;
  submitting: Accessor<boolean>;
  error: Accessor<string | undefined>;
  label: Accessor<string>;
  mode: Accessor<"create" | "edit">;
}

const FormContext = createContext<FormContextValue>();

export interface FormProviderProps {
  vm: FormViewModel;
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;
  children: JSX.Element;
}

export function FormProvider(props: FormProviderProps) {
  const vm = () => props.vm;

  const value: FormContextValue = {
    vm,
    onChange: props.onChange,
    onSubmit: props.onSubmit,
    onAction: props.onAction,

    // Derived
    fields: () => FormVM.fields(vm()),
    visibleFields: () => FormVM.visibleFields(vm()),
    groups: () => FormVM.groups(vm()),
    actions: () => vm().actions,
    allowedActions: () => FormVM.allowedActions(vm()),
    values: () => FormVM.values(vm()),
    isValid: () => FormVM.valid(vm()),
    isDirty: () => FormVM.dirty(vm()),
    canSubmit: () => FormVM.canSubmit(vm()),
    loading: () => FormVM.loading(vm()),
    submitting: () => FormVM.submitting(vm()),
    error: () => FormVM.error(vm()),
    label: () => FormVM.label(vm()),
    mode: () => vm().mode,
  };

  return (
    <FormContext.Provider value={value}>{props.children}</FormContext.Provider>
  );
}

export function useForm(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormView");
  }
  return context;
}
