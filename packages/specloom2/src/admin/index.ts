import type { CompiledSpecV2 } from "@specloom/spec";
import {
  createFormVM,
  createInputVM,
  createListVM,
  createShowVM,
} from "../facade/index.js";
import type { Context } from "../vm/types.js";

export interface Admin {
  readonly spec: CompiledSpecV2;
  readonly context: Context;
  hasResource(name: string): boolean;
  getResourceNames(): string[];
  list(
    resourceName: string,
    options: Omit<Parameters<typeof createListVM>[2], "context"> & {
      context?: Context;
    },
  ): ReturnType<typeof createListVM>;
  show(
    resourceName: string,
    options: Omit<Parameters<typeof createShowVM>[2], "context"> & {
      context?: Context;
    },
  ): ReturnType<typeof createShowVM>;
  form(
    resourceName: string,
    options: Omit<Parameters<typeof createFormVM>[2], "context"> & {
      context?: Context;
    },
  ): ReturnType<typeof createFormVM>;
  input(
    inputName: string,
    options: Omit<Parameters<typeof createInputVM>[2], "context"> & {
      context?: Context;
    },
  ): ReturnType<typeof createInputVM>;
  withContext(context: Context): Admin;
}

export function createAdmin(
  spec: CompiledSpecV2,
  defaultContext: Context = {},
): Admin {
  return {
    spec,
    context: defaultContext,
    hasResource(name) {
      return name in spec.resources;
    },
    getResourceNames() {
      return Object.keys(spec.resources);
    },
    list(resourceName, options) {
      return createListVM(spec, resourceName, {
        ...options,
        context: { ...defaultContext, ...options.context },
      });
    },
    show(resourceName, options) {
      return createShowVM(spec, resourceName, {
        ...options,
        context: { ...defaultContext, ...options.context },
      });
    },
    form(resourceName, options) {
      return createFormVM(spec, resourceName, {
        ...options,
        context: { ...defaultContext, ...options.context },
      });
    },
    input(inputName, options) {
      return createInputVM(spec, inputName, {
        ...options,
        context: { ...defaultContext, ...options.context },
      });
    },
    withContext(context) {
      return createAdmin(spec, { ...defaultContext, ...context });
    },
  };
}
