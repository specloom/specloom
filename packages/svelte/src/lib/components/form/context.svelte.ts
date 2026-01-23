import { getContext, setContext } from "svelte";
import type {
  FormViewModel,
  FormFieldVM,
  ActionVM,
  FieldGroup,
} from "specloom";
import { FormVM } from "specloom";

const FORM_CONTEXT_KEY = Symbol("form-context");

export interface RelationOption {
  value: string;
  label: string;
}

export interface FormContextValue {
  // ViewModel (getter)
  readonly vm: FormViewModel;

  // Callbacks
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;
  onOptionsSearch?: (
    resource: string,
    query: string,
  ) => Promise<RelationOption[]>;

  // Settings
  /** Timezone for date/datetime formatting (e.g., 'Asia/Tokyo', 'UTC'). undefined = local time */
  readonly timeZone: string | undefined;

  // Derived values
  readonly fields: FormFieldVM[];
  readonly visibleFields: FormFieldVM[];
  readonly groups: FieldGroup[];
  readonly actions: ActionVM[];
  readonly allowedActions: ActionVM[];
  readonly values: Record<string, unknown>;
  readonly valid: boolean;
  readonly dirty: boolean;
  readonly canSubmit: boolean;
  readonly loading: boolean;
  readonly submitting: boolean;
  readonly error: string | undefined;
  readonly label: string;
  readonly mode: "create" | "edit";
}

export interface CreateFormContextOptions {
  vm: () => FormViewModel;
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => void;
  onAction?: (actionId: string) => void;
  onOptionsSearch?: (
    resource: string,
    query: string,
  ) => Promise<RelationOption[]>;
  /** Timezone for date/datetime formatting (e.g., 'Asia/Tokyo', 'UTC'). undefined = local time. Use getter for reactivity. */
  timeZone?: () => string | undefined;
}

export function createFormContext(
  options: CreateFormContextOptions,
): FormContextValue {
  // Wrap plain data in FormVM instance
  const getVM = () => new FormVM(options.vm());

  const context: FormContextValue = {
    get vm() {
      return options.vm();
    },
    onChange: options.onChange,
    onSubmit: options.onSubmit,
    onAction: options.onAction,
    onOptionsSearch: options.onOptionsSearch,
    get timeZone() {
      return options.timeZone?.();
    },

    // Derived - OOP style via FormVM
    get fields() {
      return getVM().fields;
    },
    get visibleFields() {
      return getVM().visibleFields;
    },
    get groups() {
      return getVM().groups;
    },
    get actions() {
      return getVM().actions;
    },
    get allowedActions() {
      return getVM().allowedActions;
    },
    get values() {
      return getVM().values;
    },
    get valid() {
      return getVM().isValid;
    },
    get dirty() {
      return getVM().isDirty;
    },
    get canSubmit() {
      return getVM().canSubmit;
    },
    get loading() {
      return getVM().isLoading;
    },
    get submitting() {
      return getVM().isSubmitting;
    },
    get error() {
      return getVM().error;
    },
    get label() {
      return getVM().label;
    },
    get mode() {
      return getVM().mode;
    },
  };

  setContext(FORM_CONTEXT_KEY, context);
  return context;
}

export function getFormContext(): FormContextValue {
  const context = getContext<FormContextValue>(FORM_CONTEXT_KEY);
  if (!context) {
    throw new Error("Form components must be used within a FormView");
  }
  return context;
}
