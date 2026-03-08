import type { CompiledSpec } from "@specloom/spec";
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
import { getInput, getResource } from "../resolver/index.js";

export function createListVM(
  spec: CompiledSpec,
  resourceName: string,
  options: Omit<EvaluateListOptions, "resource">,
) {
  return evaluateListView({
    resource: getResource(spec, resourceName),
    ...options,
  });
}

export function createShowVM(
  spec: CompiledSpec,
  resourceName: string,
  options: Omit<EvaluateShowOptions, "resource">,
) {
  return evaluateShowView({
    resource: getResource(spec, resourceName),
    ...options,
  });
}

export function createFormVM(
  spec: CompiledSpec,
  resourceName: string,
  options: Omit<EvaluateFormOptions, "resource">,
) {
  return evaluateFormView({
    resource: getResource(spec, resourceName),
    ...options,
  });
}

export function createInputVM(
  spec: CompiledSpec,
  inputName: string,
  options: Omit<EvaluateInputOptions, "input">,
) {
  return evaluateInputForm({
    input: getInput(spec, inputName),
    ...options,
  });
}
