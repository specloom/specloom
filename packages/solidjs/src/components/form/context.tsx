import { createContext, useContext, type Accessor, type JSX } from "solid-js";
import type {
  FormViewModel,
  FormFieldVM,
  ActionVM,
  FieldGroup,
} from "specloom";
import { FormVM } from "specloom";
import type { RelationOption } from "../shared/FieldInput.jsx";

export interface FormContextValue {
  // ViewModel (OOP instance)
  vm: Accessor<FormVM>;

  // Callbacks
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;
  onOptionsSearch?: (
    resource: string,
    query: string,
  ) => Promise<RelationOption[]>;

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
  onOptionsSearch?: (
    resource: string,
    query: string,
  ) => Promise<RelationOption[]>;
  children: JSX.Element;
}

export function FormProvider(props: FormProviderProps) {
  // Wrap plain data in FormVM instance
  const vm = () => new FormVM(props.vm);

  const value: FormContextValue = {
    vm,
    onChange: props.onChange,
    onSubmit: props.onSubmit,
    onAction: props.onAction,
    onOptionsSearch: props.onOptionsSearch,

    // Derived (OOP style)
    fields: () => vm().fields,
    visibleFields: () => vm().visibleFields,
    groups: () => vm().groups,
    actions: () => vm().actions,
    allowedActions: () => vm().allowedActions,
    values: () => vm().values,
    isValid: () => vm().isValid,
    isDirty: () => vm().isDirty,
    canSubmit: () => vm().canSubmit,
    loading: () => vm().isLoading,
    submitting: () => vm().isSubmitting,
    error: () => vm().error,
    label: () => vm().label,
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
