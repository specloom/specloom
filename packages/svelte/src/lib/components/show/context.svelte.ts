import { getContext, setContext } from "svelte";
import type {
  ShowViewModel,
  ShowFieldVM,
  ActionVM,
  FieldGroup,
} from "specloom";
import { ShowVM } from "specloom";

const SHOW_CONTEXT_KEY = Symbol("show-context");

export interface ShowContextValue {
  // ViewModel (getter)
  readonly vm: ShowViewModel;

  // Callbacks
  onAction?: (actionId: string) => void;

  // Derived values
  readonly fields: ShowFieldVM[];
  readonly groups: FieldGroup[];
  readonly actions: ActionVM[];
  readonly allowedActions: ActionVM[];
  readonly loading: boolean;
  readonly error: string | undefined;
  readonly label: string;
  readonly id: string;
}

export interface CreateShowContextOptions {
  vm: () => ShowViewModel;
  onAction?: (actionId: string) => void;
}

export function createShowContext(
  options: CreateShowContextOptions,
): ShowContextValue {
  // Wrap plain data in ShowVM instance
  const getVM = () => new ShowVM(options.vm());

  const context: ShowContextValue = {
    get vm() {
      return options.vm();
    },
    onAction: options.onAction,

    // Derived - OOP style via ShowVM
    get fields() {
      return getVM().fields;
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
    get loading() {
      return getVM().isLoading;
    },
    get error() {
      return getVM().error;
    },
    get label() {
      return getVM().label;
    },
    get id() {
      return getVM().id;
    },
  };

  setContext(SHOW_CONTEXT_KEY, context);
  return context;
}

export function getShowContext(): ShowContextValue {
  const context = getContext<ShowContextValue>(SHOW_CONTEXT_KEY);
  if (!context) {
    throw new Error("Show components must be used within a ShowView");
  }
  return context;
}
