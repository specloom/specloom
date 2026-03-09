import type {
  CompiledInput,
  CompiledResource,
} from "@specloom/spec";
import { evaluateFormView, evaluateInputForm } from "../evaluator/index.js";
import { updateFieldValue } from "../normalize/index.js";
import {
  serializeInput,
  serializeResource,
  type SerializeOptions,
} from "../serialize/index.js";
import {
  validateForm,
  type ValidationMode,
  type ValidationResult,
} from "../validation/index.js";
import type { Context, FormViewModel, ValidationErrors } from "../vm/types.js";

type RecordTarget = CompiledResource | CompiledInput;
type RecordTargetKind = "resource" | "input";

export interface FormStateSnapshot {
  target: RecordTarget;
  targetKind: RecordTargetKind;
  mode: ValidationMode;
  context: Context;
  values: Record<string, unknown>;
  errors: ValidationErrors;
  formErrors: string[];
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  initialValues: Record<string, unknown>;
}

export interface CreateFormStateArgs {
  resource: CompiledResource;
  mode: ValidationMode;
  context?: Context;
  values?: Record<string, unknown>;
  errors?: ValidationErrors;
}

export interface CreateInputStateArgs {
  input: CompiledInput;
  context?: Context;
  values?: Record<string, unknown>;
  errors?: ValidationErrors;
}

export interface FormState {
  snapshot(): FormStateSnapshot;
  view(): FormViewModel;
  getValue(name: string): unknown;
  setValue(name: string, rawValue: unknown): FormState;
  patch(values: Record<string, unknown>): FormState;
  reset(values?: Record<string, unknown>): FormState;
  touch(name: string): FormState;
  setErrors(errors: ValidationErrors): FormState;
  clearErrors(name?: string): FormState;
  validate(): { state: FormState; result: ValidationResult };
  serialize(options?: SerializeOptions): Record<string, unknown>;
}

export function createFormState(args: CreateFormStateArgs): FormState {
  const values = args.values ?? {};

  return createRecordState({
    targetKind: "resource",
    target: args.resource,
    mode: args.mode,
    context: args.context ?? {},
    values,
    errors: args.errors ?? {},
    formErrors: [],
    touched: {},
    dirty: {},
    initialValues: { ...values },
  });
}

export function createInputState(args: CreateInputStateArgs): FormState {
  const values = args.values ?? {};

  return createRecordState({
    targetKind: "input",
    target: args.input,
    mode: "create",
    context: args.context ?? {},
    values,
    errors: args.errors ?? {},
    formErrors: [],
    touched: {},
    dirty: {},
    initialValues: { ...values },
  });
}

function createRecordState(args: FormStateSnapshot): FormState {
  const snapshot: FormStateSnapshot = { ...args };

  function next(patch: Partial<FormStateSnapshot>): FormState {
    return createRecordState({
      ...snapshot,
      ...patch,
    });
  }

  return {
    snapshot() {
      return structuredClone(snapshot);
    },
    view() {
      if (snapshot.targetKind === "resource") {
        return evaluateFormView({
          resource: snapshot.target as CompiledResource,
          context: snapshot.context,
          mode: snapshot.mode,
          record: snapshot.values,
          errors: snapshot.errors,
          isDirty: Object.values(snapshot.dirty).some(Boolean),
        });
      }

      return evaluateInputForm({
        input: snapshot.target as CompiledInput,
        context: snapshot.context,
        record: snapshot.values,
        errors: snapshot.errors,
        isDirty: Object.values(snapshot.dirty).some(Boolean),
      });
    },
    getValue(name) {
      return snapshot.values[name];
    },
    setValue(name, rawValue) {
      const nextValues = updateFieldValue({
        resource: snapshot.target,
        values: snapshot.values,
        fieldName: name,
        rawValue,
      });

      const nextDirty = {
        ...snapshot.dirty,
        [name]: nextValues[name] !== snapshot.initialValues[name],
      };

      return next({
        values: nextValues,
        dirty: nextDirty,
        touched: {
          ...snapshot.touched,
          [name]: true,
        },
        errors: clearFieldError(snapshot.errors, name),
        formErrors: [],
      });
    },
    patch(values) {
      let current: FormState = this;
      for (const [name, rawValue] of Object.entries(values)) {
        current = current.setValue(name, rawValue);
      }
      return current;
    },
    reset(values) {
      const nextValues = values ? { ...values } : { ...snapshot.initialValues };
      return next({
        values: nextValues,
        errors: {},
        formErrors: [],
        touched: {},
        dirty: {},
        initialValues: values ? { ...values } : snapshot.initialValues,
      });
    },
    touch(name) {
      return next({
        touched: {
          ...snapshot.touched,
          [name]: true,
        },
      });
    },
    setErrors(errors) {
      return next({ errors });
    },
    clearErrors(name) {
      if (!name) {
        return next({ errors: {}, formErrors: [] });
      }
      return next({
        errors: clearFieldError(snapshot.errors, name),
      });
    },
    validate() {
      const result = validateForm({
        resource: snapshot.target,
        values: snapshot.values,
        context: snapshot.context,
        mode: snapshot.mode,
      });

      const state = next({
        errors: result.errors,
        formErrors: result.formErrors,
      });

      return { state, result };
    },
    serialize(options) {
      return snapshot.targetKind === "resource"
        ? serializeResource(
            snapshot.target as CompiledResource,
            snapshot.values,
            options,
          )
        : serializeInput(
            snapshot.target as CompiledInput,
            snapshot.values,
            options,
          );
    },
  };
}

function clearFieldError(
  errors: ValidationErrors,
  fieldName: string,
): ValidationErrors {
  const next = { ...errors };
  delete next[fieldName];
  return next;
}
