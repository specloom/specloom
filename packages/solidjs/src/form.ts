import {
  createFormState,
  createInputState,
  type Context,
  type CreateFormStateArgs,
  type CreateInputStateArgs,
  type FormState,
  type FormStateSnapshot,
  type FormViewModel,
  type SerializeOptions,
  type ValidationErrors,
  type ValidationResult,
} from "specloom";
import { createMemo, createSignal, type Accessor } from "solid-js";
import type { SpecloomRuntime } from "./client.js";
import { useSpecloom } from "./context.js";

export interface SolidFormStore {
  state: Accessor<FormState>;
  snapshot: Accessor<FormStateSnapshot>;
  view: Accessor<FormViewModel>;
  getValue(name: string): unknown;
  setValue(name: string, value: unknown): void;
  patch(values: Record<string, unknown>): void;
  reset(values?: Record<string, unknown>): void;
  touch(name: string): void;
  setErrors(errors: ValidationErrors): void;
  clearErrors(name?: string): void;
  validate(): ValidationResult;
  serialize(options?: SerializeOptions): Record<string, unknown>;
}

export interface CreateSolidFormStoreArgs
  extends Omit<CreateFormStateArgs, "context"> {
  runtime?: SpecloomRuntime;
  context?: Context;
}

export interface CreateSolidInputStoreArgs
  extends Omit<CreateInputStateArgs, "context"> {
  runtime?: SpecloomRuntime;
  context?: Context;
}

export function createFormStore(args: CreateSolidFormStoreArgs): SolidFormStore {
  return createSolidFormStore(
    createFormState({
      spec: args.spec,
      resource: args.resource,
      mode: args.mode,
      context: resolveContext(args.runtime, args.context),
      values: args.values,
      errors: args.errors,
    }),
  );
}

export function useFormStore(
  args: Omit<CreateSolidFormStoreArgs, "runtime">,
): SolidFormStore {
  return createFormStore({
    ...args,
    runtime: useSpecloom(),
  });
}

export function createInputStore(
  args: CreateSolidInputStoreArgs,
): SolidFormStore {
  return createSolidFormStore(
    createInputState({
      spec: args.spec,
      input: args.input,
      context: resolveContext(args.runtime, args.context),
      values: args.values,
      errors: args.errors,
    }),
  );
}

export function useInputStore(
  args: Omit<CreateSolidInputStoreArgs, "runtime">,
): SolidFormStore {
  return createInputStore({
    ...args,
    runtime: useSpecloom(),
  });
}

function createSolidFormStore(initialState: FormState): SolidFormStore {
  const [state, setState] = createSignal(initialState);
  const snapshot = createMemo(() => state().snapshot());
  const view = createMemo(() => state().view());

  function update(next: FormState) {
    setState(() => next);
  }

  return {
    state,
    snapshot,
    view,
    getValue(name) {
      return state().getValue(name);
    },
    setValue(name, value) {
      update(state().setValue(name, value));
    },
    patch(values) {
      update(state().patch(values));
    },
    reset(values) {
      update(state().reset(values));
    },
    touch(name) {
      update(state().touch(name));
    },
    setErrors(errors) {
      update(state().setErrors(errors));
    },
    clearErrors(name) {
      update(state().clearErrors(name));
    },
    validate() {
      const result = state().validate();
      update(result.state);
      return result.result;
    },
    serialize(options) {
      return state().serialize(options);
    },
  };
}

function resolveContext(runtime?: SpecloomRuntime, context?: Context): Context {
  if (!runtime) {
    return context ?? {};
  }
  return runtime.resolveContext(context);
}
