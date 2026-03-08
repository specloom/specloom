import type {
  CompiledInput,
  CompiledResource,
  CompiledSpec,
} from "@specloom/spec";
import { evaluateFormView, evaluateInputForm } from "../evaluator/index.js";
import { updateFieldValue } from "../normalize/index.js";
import {
  serializeInput,
  serializeResource,
  type SerializeOptions,
} from "../serialize/index.js";
import { getInput, getResource } from "../resolver/index.js";
import {
  validateForm,
  type ValidationMode,
  type ValidationResult,
} from "../validation/index.js";
import type { Context, FormViewModel, ValidationErrors } from "../vm/types.js";

type RecordTarget = CompiledResource | CompiledInput;
type RecordTargetKind = "resource" | "input";

export interface FormStateSnapshot {
  spec: CompiledSpec;
  targetKind: RecordTargetKind;
  targetName: string;
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
  spec: CompiledSpec;
  resource: string;
  mode: ValidationMode;
  context?: Context;
  values?: Record<string, unknown>;
  errors?: ValidationErrors;
}

export interface CreateInputStateArgs {
  spec: CompiledSpec;
  input: string;
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
  const target = getResource(args.spec, args.resource);
  const values = args.values ?? {};

  return createRecordState({
    spec: args.spec,
    targetKind: "resource",
    target,
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
  const target = getInput(args.spec, args.input);
  const values = args.values ?? {};

  return createRecordState({
    spec: args.spec,
    targetKind: "input",
    target,
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

interface CreateRecordStateArgs extends Omit<FormStateSnapshot, "targetName"> {
  targetKind: RecordTargetKind;
  target: RecordTarget;
}

function createRecordState(args: CreateRecordStateArgs): FormState {
  const snapshot: FormStateSnapshot = {
    spec: args.spec,
    targetKind: args.targetKind,
    targetName: args.target.name,
    mode: args.mode,
    context: args.context,
    values: args.values,
    errors: args.errors,
    formErrors: args.formErrors,
    touched: args.touched,
    dirty: args.dirty,
    initialValues: args.initialValues,
  };

  function next(patch: Partial<FormStateSnapshot>): FormState {
    const target = getTarget(
      snapshot.spec,
      snapshot.targetKind,
      snapshot.targetName,
    );
    return createRecordState({
      spec: patch.spec ?? snapshot.spec,
      targetKind: snapshot.targetKind,
      target,
      mode: patch.mode ?? snapshot.mode,
      context: patch.context ?? snapshot.context,
      values: patch.values ?? snapshot.values,
      errors: patch.errors ?? snapshot.errors,
      formErrors: patch.formErrors ?? snapshot.formErrors,
      touched: patch.touched ?? snapshot.touched,
      dirty: patch.dirty ?? snapshot.dirty,
      initialValues: patch.initialValues ?? snapshot.initialValues,
    });
  }

  return {
    snapshot() {
      return structuredClone(snapshot);
    },
    view() {
      if (snapshot.targetKind === "resource") {
        const target = getResource(snapshot.spec, snapshot.targetName);
        return evaluateFormView({
          resource: target,
          context: snapshot.context,
          mode: snapshot.mode,
          record: snapshot.values,
          errors: snapshot.errors,
          isDirty: Object.values(snapshot.dirty).some(Boolean),
        });
      }

      const target = getInput(snapshot.spec, snapshot.targetName);
      return evaluateInputForm({
        input: target,
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
      const target = getTarget(
        snapshot.spec,
        snapshot.targetKind,
        snapshot.targetName,
      );
      const nextValues = updateFieldValue({
        resource: target,
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
      const target = getTarget(
        snapshot.spec,
        snapshot.targetKind,
        snapshot.targetName,
      );
      const result = validateForm({
        resource: target,
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
            getResource(snapshot.spec, snapshot.targetName),
            snapshot.values,
            options,
          )
        : serializeInput(
            getInput(snapshot.spec, snapshot.targetName),
            snapshot.values,
            options,
          );
    },
  };
}

function getTarget(
  spec: CompiledSpec,
  kind: RecordTargetKind,
  name: string,
): RecordTarget {
  return kind === "resource" ? getResource(spec, name) : getInput(spec, name);
}

function clearFieldError(
  errors: ValidationErrors,
  fieldName: string,
): ValidationErrors {
  const next = { ...errors };
  delete next[fieldName];
  return next;
}
