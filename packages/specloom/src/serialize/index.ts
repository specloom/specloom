// ============================================================
// Serialize - 送信用データ変換
// ============================================================

import type { FormViewModel } from "../ui/types.js";

/**
 * シリアライズオプション
 */
export interface SerializeOptions {
  /** nullを除外するか */
  excludeNull?: boolean;
  /** 空文字を除外するか */
  excludeEmpty?: boolean;
  /** 日付のフォーマット */
  dateFormat?: "iso" | "timestamp" | "date-only";
}

/**
 * シリアライズ関数
 */
export const Serialize = {
  /**
   * フォームデータを送信用オブジェクトに変換
   */
  formData: (
    vm: FormViewModel,
    options?: SerializeOptions,
  ): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const field of vm.fields) {
      const value = field.value;

      // null除外
      if (options?.excludeNull && value == null) continue;

      // 空文字除外
      if (options?.excludeEmpty && value === "") continue;

      // 日付変換
      if (value instanceof Date) {
        result[field.name] = serializeDate(value, options?.dateFormat);
      } else {
        result[field.name] = value;
      }
    }

    return result;
  },

  /**
   * 変更されたフィールドのみを取得
   */
  dirtyFields: (
    vm: FormViewModel,
    original: Record<string, unknown>,
  ): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const field of vm.fields) {
      const currentValue = field.value;
      const originalValue = original[field.name];

      if (!deepEqual(currentValue, originalValue)) {
        result[field.name] = currentValue;
      }
    }

    return result;
  },

  /**
   * URLクエリパラメータに変換
   */
  queryParams: (
    params: Record<string, unknown>,
    options?: { arrayFormat?: "bracket" | "index" | "comma" },
  ): string => {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value == null) continue;

      if (Array.isArray(value)) {
        serializeArray(searchParams, key, value, options?.arrayFormat);
      } else if (typeof value === "object") {
        // オブジェクトはJSON文字列化
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }

    return searchParams.toString();
  },

  /**
   * FormDataオブジェクトに変換（ファイルアップロード対応）
   */
  multipart: (
    vm: FormViewModel,
    files?: Record<string, File | File[]>,
  ): FormData => {
    const formData = new FormData();

    for (const field of vm.fields) {
      const value = field.value;
      if (value == null) continue;

      if (value instanceof File || value instanceof Blob) {
        // File/Blob はそのまま追加
        formData.append(field.name, value);
      } else if (value instanceof Date) {
        formData.append(field.name, value.toISOString());
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (item instanceof File || item instanceof Blob) {
            formData.append(`${field.name}[]`, item);
          } else {
            formData.append(`${field.name}[]`, String(item));
          }
        }
      } else if (typeof value === "object") {
        // プレーンオブジェクトのみ JSON 文字列化
        formData.append(field.name, JSON.stringify(value));
      } else {
        formData.append(field.name, String(value));
      }
    }

    // ファイル追加
    if (files) {
      for (const [key, file] of Object.entries(files)) {
        if (Array.isArray(file)) {
          for (const f of file) {
            formData.append(`${key}[]`, f);
          }
        } else {
          formData.append(key, file);
        }
      }
    }

    return formData;
  },

  /**
   * JSON文字列に変換
   */
  json: (
    vm: FormViewModel,
    options?: SerializeOptions & { pretty?: boolean },
  ): string => {
    const data = Serialize.formData(vm, options);
    return options?.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  },

  /**
   * リストフィルターをクエリパラメータに変換
   */
  listFilters: (filters: Record<string, unknown>): string => {
    return Serialize.queryParams(filters, { arrayFormat: "bracket" });
  },

  /**
   * ページネーションパラメータを生成
   */
  pagination: (
    page: number,
    pageSize: number,
    options?: { pageKey?: string; sizeKey?: string },
  ): Record<string, number> => {
    return {
      [options?.pageKey ?? "page"]: page,
      [options?.sizeKey ?? "pageSize"]: pageSize,
    };
  },

  /**
   * ソートパラメータを生成
   */
  sort: (
    field: string,
    order: "asc" | "desc",
    options?: { fieldKey?: string; orderKey?: string; combined?: boolean },
  ): Record<string, string> => {
    if (options?.combined) {
      return { sort: `${field}:${order}` };
    }
    return {
      [options?.fieldKey ?? "sortField"]: field,
      [options?.orderKey ?? "sortOrder"]: order,
    };
  },
};

/**
 * 日付をシリアライズ
 */
function serializeDate(
  date: Date,
  format?: "iso" | "timestamp" | "date-only",
): string | number {
  switch (format) {
    case "timestamp":
      return date.getTime();
    case "date-only":
      return date.toISOString().split("T")[0];
    case "iso":
    default:
      return date.toISOString();
  }
}

/**
 * 配列をシリアライズ
 */
function serializeArray(
  params: URLSearchParams,
  key: string,
  value: unknown[],
  format?: "bracket" | "index" | "comma",
): void {
  switch (format) {
    case "index":
      value.forEach((v, i) => {
        params.append(`${key}[${i}]`, String(v));
      });
      break;
    case "comma":
      if (value.length > 0) {
        params.append(key, value.join(","));
      }
      break;
    case "bracket":
    default:
      for (const v of value) {
        params.append(`${key}[]`, String(v));
      }
  }
}

/**
 * 深い等価性チェック
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      ),
    );
  }

  return false;
}
