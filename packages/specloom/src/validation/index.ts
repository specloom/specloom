import type { Field } from "../spec/index.js";
import { i18n } from "../i18n/index.js";

/**
 * フィールドごとのエラーメッセージ
 */
export type ValidationErrors = Record<string, string[]>;

/**
 * フォームデータをバリデーションする
 */
export function validateForm(
  fields: Field[],
  data: Record<string, unknown>,
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of fields) {
    const value = data[field.name];
    const fieldErrors = validateField(field, value, data);
    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors;
    }
  }

  return errors;
}

export function validateField(
  field: Field,
  value: unknown,
  allValues?: Record<string, unknown>,
): string[] {
  const errors: string[] = [];
  const validation = field.validation ?? {};
  const t = i18n.t();

  // required
  if (field.required || validation.required) {
    if (isEmpty(value)) {
      errors.push(t.validation.required(field.label ?? field.name));
      return errors; // 必須エラーの場合、他のバリデーションはスキップ
    }
  }

  // 値がない場合、他のバリデーションはスキップ（配列は除く）
  if (isEmpty(value) && !Array.isArray(value)) {
    return errors;
  }

  // 文字列バリデーション
  if (typeof value === "string") {
    if (validation.minLength != null && value.length < validation.minLength) {
      errors.push(t.validation.minLength(validation.minLength));
    }
    if (validation.maxLength != null && value.length > validation.maxLength) {
      errors.push(t.validation.maxLength(validation.maxLength));
    }
    if (validation.pattern != null) {
      const patternError = validatePattern(value, validation.pattern, t);
      if (patternError) {
        errors.push(patternError);
      }
    }
  }

  // 数値バリデーション
  if (typeof value === "number") {
    if (validation.min != null && value < validation.min) {
      errors.push(t.validation.min(validation.min));
    }
    if (validation.max != null && value > validation.max) {
      errors.push(t.validation.max(validation.max));
    }
  }

  // 配列バリデーション
  if (Array.isArray(value)) {
    if (validation.minItems != null && value.length < validation.minItems) {
      errors.push(t.validation.minItems(validation.minItems));
    }
    if (validation.maxItems != null && value.length > validation.maxItems) {
      errors.push(t.validation.maxItems(validation.maxItems));
    }
  }

  // 他フィールドとの一致チェック（例: password / passwordConfirm）
  if (validation.match) {
    const otherValue = allValues?.[validation.match];
    if (otherValue !== undefined && value !== otherValue) {
      errors.push(t.validation.match(validation.match));
    }
  }

  return errors;
}

/**
 * パターンバリデーション
 */
function validatePattern(
  value: string,
  pattern: string,
  t: ReturnType<typeof i18n.t>,
): string | null {
  switch (pattern) {
    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return t.validation.email;
      }
      break;
    }
    case "url": {
      try {
        new URL(value);
      } catch {
        return t.validation.url;
      }
      break;
    }
    case "tel": {
      const telRegex = /^[\d\-+()]+$/;
      if (!telRegex.test(value)) {
        return t.validation.tel;
      }
      break;
    }
    default: {
      // カスタム正規表現
      try {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          return t.validation.pattern;
        }
      } catch {
        // 無効な正規表現は無視
      }
    }
  }

  return null;
}

/**
 * 値が空かどうかを判定
 */
function isEmpty(value: unknown): boolean {
  if (typeof value === "boolean") return false;
  if (value == null) return true;
  if (value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

// ============================================================
// Validate - バリデーション操作関数
// ============================================================

/**
 * バリデーション操作関数
 * UIモジュールと連携して使用する
 */
export const Validate = {
  /**
   * フォーム全体をバリデーション
   */
  form: validateForm,

  /**
   * 単一フィールドをバリデーション
   */
  field: validateField,

  /**
   * バリデーション結果が有効かどうか
   */
  valid: (errors: ValidationErrors): boolean => {
    return Object.keys(errors).length === 0;
  },

  /**
   * 特定フィールドのエラーを取得
   */
  errors: (errors: ValidationErrors, fieldName: string): string[] => {
    return errors[fieldName] ?? [];
  },

  /**
   * 特定フィールドにエラーがあるか
   */
  hasError: (errors: ValidationErrors, fieldName: string): boolean => {
    return (errors[fieldName]?.length ?? 0) > 0;
  },

  /**
   * 最初のエラーメッセージを取得
   */
  firstError: (errors: ValidationErrors, fieldName: string): string | null => {
    return errors[fieldName]?.[0] ?? null;
  },

  /**
   * 全エラーメッセージをフラット配列で取得
   */
  allErrors: (errors: ValidationErrors): string[] => {
    return Object.values(errors).flat();
  },

  /**
   * 空値チェック
   */
  empty: isEmpty,
};
