import { getContext, setContext } from "svelte";
import type {
  ShowViewModel,
  ShowFieldVM,
  ActionVM,
  FieldGroup,
} from "specloom";
import { ShowHelpers } from "specloom";

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
  const context: ShowContextValue = {
    get vm() {
      return options.vm();
    },
    onAction: options.onAction,

    // Derived - 直接プロパティアクセス
    get fields() {
      return options.vm().fields;
    },
    get groups() {
      return options.vm().groups ?? [];
    },
    get actions() {
      return options.vm().actions;
    },
    get allowedActions() {
      return ShowHelpers.allowedActions(options.vm());
    },
    get loading() {
      return options.vm().isLoading ?? false;
    },
    get error() {
      return options.vm().error;
    },
    get label() {
      return options.vm().label;
    },
    get id() {
      return options.vm().id;
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
