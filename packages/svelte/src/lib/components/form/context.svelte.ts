import { getContext, setContext } from "svelte";
import type {
  FormViewModel,
  FormFieldVM,
  ActionVM,
  FieldGroup,
} from "specloom";
import { FormHelpers, ActionHelpers } from "specloom";

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

    // Derived - 直接プロパティアクセス
    get fields() {
      return options.vm().fields;
    },
    get visibleFields() {
      return FormHelpers.visibleFields(options.vm());
    },
    get groups() {
      return options.vm().groups ?? [];
    },
    get actions() {
      return options.vm().actions;
    },
    get allowedActions() {
      return FormHelpers.allowedActions(options.vm());
    },
    get values() {
      return FormHelpers.values(options.vm());
    },
    get valid() {
      return options.vm().isValid;
    },
    get dirty() {
      return options.vm().isDirty;
    },
    get canSubmit() {
      return FormHelpers.canSubmit(options.vm());
    },
    get loading() {
      return options.vm().isLoading ?? false;
    },
    get submitting() {
      return options.vm().isSubmitting ?? false;
    },
    get error() {
      return options.vm().error;
    },
    get label() {
      return options.vm().label;
    },
    get mode() {
      return options.vm().mode;
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
