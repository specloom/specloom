// ============================================================
// Admin Registry - Spec + Context を保持する便利クラス
// ============================================================

import type { Spec, Resource } from "../spec/index.js";
import type { Context } from "../vm/types.js";
import type { ValidationErrors } from "../validation/index.js";
import type { ListVM } from "../vm/list.js";
import type { FormVM } from "../vm/form.js";
import type { ShowVM } from "../vm/show.js";
import { createListVM, createShowVM, createFormVM } from "../facade/index.js";

/**
 * Spec と デフォルト Context を保持し、ViewModel 生成を簡潔にするレジストリ。
 * イミュータブル — `withContext()` は新しいインスタンスを返す。
 *
 * @example
 * ```typescript
 * const admin = createAdmin(spec, { role: 'admin' });
 * const listVM = admin.list('Post', { data: posts });
 * const formVM = admin.form('Post', { mode: 'create' });
 * ```
 */
export class Admin {
  private readonly spec: Spec;
  private readonly defaultContext: Context;

  constructor(spec: Spec, defaultContext: Context) {
    this.spec = structuredClone(spec);
    this.defaultContext = structuredClone(defaultContext);
  }

  /**
   * ListVM を生成する。context 省略時はデフォルトコンテキストを使用。
   */
  list(
    resourceName: string,
    options: {
      data: Record<string, unknown>[];
      context?: Context;
      activeFilter?: string;
      searchQuery?: string;
      selected?: string[];
    },
  ): ListVM {
    return createListVM(this.spec, resourceName, {
      context: options.context ?? this.defaultContext,
      data: options.data,
      activeFilter: options.activeFilter,
      searchQuery: options.searchQuery,
      selected: options.selected,
    });
  }

  /**
   * ShowVM を生成する。context 省略時はデフォルトコンテキストを使用。
   */
  show(
    resourceName: string,
    options: {
      data: Record<string, unknown>;
      context?: Context;
    },
  ): ShowVM {
    return createShowVM(this.spec, resourceName, {
      context: options.context ?? this.defaultContext,
      data: options.data,
    });
  }

  /**
   * FormVM を生成する。context 省略時はデフォルトコンテキストを使用。
   */
  form(
    resourceName: string,
    options: {
      mode: "create" | "edit";
      data?: Record<string, unknown>;
      context?: Context;
      errors?: ValidationErrors;
      isDirty?: boolean;
    },
  ): FormVM {
    return createFormVM(this.spec, resourceName, {
      context: options.context ?? this.defaultContext,
      mode: options.mode,
      data: options.data,
      errors: options.errors,
      isDirty: options.isDirty,
    });
  }

  /**
   * 新しいデフォルトコンテキストで Admin を生成する（イミュータブル）。
   */
  withContext(context: Context): Admin {
    return new Admin(this.spec, context);
  }

  getSpec(): Spec {
    return structuredClone(this.spec);
  }

  getContext(): Context {
    return structuredClone(this.defaultContext);
  }

  hasResource(name: string): boolean {
    return this.spec.resources.some((r) => r.name === name);
  }

  getResource(name: string): Resource | undefined {
    const resource = this.spec.resources.find((r) => r.name === name);
    return resource ? structuredClone(resource) : undefined;
  }

  getResourceNames(): string[] {
    return this.spec.resources.map((r) => r.name);
  }
}

/**
 * Admin インスタンスを生成する。
 *
 * @example
 * ```typescript
 * const admin = createAdmin(spec, { role: 'admin' });
 * ```
 */
export function createAdmin(spec: Spec, defaultContext: Context): Admin {
  return new Admin(spec, defaultContext);
}
