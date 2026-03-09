import type { CompiledInput, CompiledResource } from "@specloom/spec";
import {
  evaluateFormView,
  evaluateInputForm,
  evaluateListView,
  evaluateShowView,
  type EvaluateFormOptions,
  type EvaluateInputOptions,
  type EvaluateListOptions,
  type EvaluateShowOptions,
} from "../evaluator/index.js";

export function createListVM(
  resource: CompiledResource,
  options: Omit<EvaluateListOptions, "resource">,
) {
  return evaluateListView({
    resource,
    ...options,
  });
}

export function createShowVM(
  resource: CompiledResource,
  options: Omit<EvaluateShowOptions, "resource">,
) {
  return evaluateShowView({
    resource,
    ...options,
  });
}

export function createFormVM(
  resource: CompiledResource,
  options: Omit<EvaluateFormOptions, "resource">,
) {
  return evaluateFormView({
    resource,
    ...options,
  });
}

export function createInputVM(
  input: CompiledInput,
  options: Omit<EvaluateInputOptions, "input">,
) {
  return evaluateInputForm({
    input,
    ...options,
  });
}
