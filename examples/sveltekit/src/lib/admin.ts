import type { Spec, Resource, View, ListView, ShowView, FormView } from "specloom";
import spec from "./spec.json";

// 型安全のため Spec として export
export const adminSpec = spec as Spec;

/**
 * リソース名から Resource を取得
 */
export function getResource(name: string): Resource | undefined {
  return adminSpec.resources.find((r) => r.name === name);
}

/**
 * リソース名とビュータイプから View を取得
 */
export function getView(
  resourceName: string,
  viewType: "list" | "show" | "form",
): View | undefined {
  return adminSpec.views.find(
    (v) => v.resource === resourceName && v.type === viewType,
  );
}

/**
 * ListView を取得
 */
export function getListView(resourceName: string): ListView | undefined {
  const view = getView(resourceName, "list");
  return view?.type === "list" ? view : undefined;
}

/**
 * ShowView を取得
 */
export function getShowView(resourceName: string): ShowView | undefined {
  const view = getView(resourceName, "show");
  return view?.type === "show" ? view : undefined;
}

/**
 * FormView を取得
 */
export function getFormView(resourceName: string): FormView | undefined {
  const view = getView(resourceName, "form");
  return view?.type === "form" ? view : undefined;
}
