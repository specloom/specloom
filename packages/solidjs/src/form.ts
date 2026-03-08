import type { CompiledSpec } from "@specloom/spec";
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
import type { SpecloomClient } from "./client.js";
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
  extends Omit<CreateFormStateArgs, "spec" | "context"> {
  client?: SpecloomClient;
  spec?: CompiledSpec;
  context?: Context;
}

export interface CreateSolidInputStoreArgs
  extends Omit<CreateInputStateArgs, "spec" | "context"> {
  client?: SpecloomClient;
  spec?: CompiledSpec;
  context?: Context;
}

export function createFormStore(args: CreateSolidFormStoreArgs): SolidFormStore {
  return createSolidFormStore(
    createFormState({
      spec: resolveSpec(args),
      resource: args.resource,
      mode: args.mode,
      context: resolveContext(args.client, args.context),
      values: args.values,
      errors: args.errors,
    }),
  );
}

export function useFormStore(
  args: Omit<CreateSolidFormStoreArgs, "client">,
): SolidFormStore {
  return createFormStore({
    ...args,
    client: useSpecloom(),
  });
}

export function createInputStore(
  args: CreateSolidInputStoreArgs,
): SolidFormStore {
  return createSolidFormStore(
    createInputState({
      spec: resolveSpec(args),
      input: args.input,
      context: resolveContext(args.client, args.context),
      values: args.values,
      errors: args.errors,
    }),
  );
}

export function useInputStore(
  args: Omit<CreateSolidInputStoreArgs, "client">,
): SolidFormStore {
  return createInputStore({
    ...args,
    client: useSpecloom(),
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

function resolveSpec(args: {
  client?: SpecloomClient;
  spec?: CompiledSpec;
}): CompiledSpec {
  if (args.spec) {
    return args.spec;
  }
  if (args.client) {
    return args.client.spec;
  }
  throw new Error("spec or client is required");
}

function resolveContext(client?: SpecloomClient, context?: Context): Context {
  if (!client) {
    return context ?? {};
  }
  return client.resolveContext(context);
}
