// ============================================================
// Facade Functions - ViewModel 生成のショートカット
// ============================================================

import type {
  Spec,
  Resource,
  View,
  ListView,
  ShowView,
  FormView,
  ViewType,
} from "../spec/index.js";
import type { Context } from "../vm/types.js";
import type { ValidationErrors } from "../validation/index.js";
import { evaluateListView, evaluateShowView, evaluateFormView } from "../evaluator/index.js";
import { ListVM } from "../vm/list.js";
import { FormVM } from "../vm/form.js";
import { ShowVM } from "../vm/show.js";

// ============================================================
// Error
// ============================================================

export class FacadeError extends Error {
  override name = "FacadeError";
}

// ============================================================
// Internal Helpers
// ============================================================

function findResource(spec: Spec, name: string): Resource {
  const resource = spec.resources.find((r) => r.name === name);
  if (!resource) {
    throw new FacadeError(`Resource not found: ${name}`);
  }
  return resource;
}

function findView<T extends View>(
  spec: Spec,
  resourceName: string,
  type: ViewType,
): T {
  const matches = spec.views.filter(
    (v) => v.resource === resourceName && v.type === type,
  );
  if (matches.length === 0) {
    throw new FacadeError(`${type} view not found for resource: ${resourceName}`);
  }
  if (matches.length > 1) {
    throw new FacadeError(
      `Multiple ${type} views found for resource: ${resourceName} (found ${matches.length}). Use evaluateListView/evaluateShowView/evaluateFormView directly to specify which view to use.`,
    );
  }
  return matches[0] as T;
}

// ============================================================
// Facade Functions
// ============================================================

/**
 * Spec + リソース名から ListVM を直接生成する
 *
 * @example
 * ```typescript
 * const vm = createListVM(spec, 'Post', { context, data: posts });
 * ```
 */
export function createListVM(
  spec: Spec,
  resourceName: string,
  options: {
    context: Context;
    data: Record<string, unknown>[];
    activeFilter?: string;
    searchQuery?: string;
    selected?: string[];
  },
): ListVM {
  const resource = findResource(spec, resourceName);
  const view = findView<ListView>(spec, resourceName, "list");
  const viewModel = evaluateListView({
    view,
    resource,
    context: options.context,
    data: options.data,
    activeFilter: options.activeFilter,
    searchQuery: options.searchQuery,
    selected: options.selected,
  });
  return new ListVM(viewModel);
}

/**
 * Spec + リソース名から ShowVM を直接生成する
 *
 * @example
 * ```typescript
 * const vm = createShowVM(spec, 'Post', { context, data: post });
 * ```
 */
export function createShowVM(
  spec: Spec,
  resourceName: string,
  options: {
    context: Context;
    data: Record<string, unknown>;
  },
): ShowVM {
  const resource = findResource(spec, resourceName);
  const view = findView<ShowView>(spec, resourceName, "show");
  const viewModel = evaluateShowView({
    view,
    resource,
    context: options.context,
    data: options.data,
  });
  return new ShowVM(viewModel);
}

/**
 * Spec + リソース名から FormVM を直接生成する
 *
 * @example
 * ```typescript
 * const vm = createFormVM(spec, 'Post', { context, mode: 'create' });
 * ```
 */
export function createFormVM(
  spec: Spec,
  resourceName: string,
  options: {
    context: Context;
    mode: "create" | "edit";
    data?: Record<string, unknown>;
    errors?: ValidationErrors;
    isDirty?: boolean;
  },
): FormVM {
  const resource = findResource(spec, resourceName);
  const view = findView<FormView>(spec, resourceName, "form");
  const viewModel = evaluateFormView({
    view,
    resource,
    context: options.context,
    mode: options.mode,
    data: options.data,
    errors: options.errors,
    isDirty: options.isDirty,
  });
  return new FormVM(viewModel);
}
