import type { Field, FieldValidation } from "../spec/index.js";

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
    const fieldErrors = validateField(field, value);
    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors;
    }
  }

  return errors;
}

/**
 * 単一フィールドをバリデーションする
 */
export function validateField(field: Field, value: unknown): string[] {
  const errors: string[] = [];
  const validation = field.validation ?? {};

  // required
  if (field.required || validation.required) {
    if (isEmpty(value)) {
      errors.push(`${field.label ?? field.name}は必須です`);
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
      errors.push(`${validation.minLength}文字以上で入力してください`);
    }
    if (validation.maxLength != null && value.length > validation.maxLength) {
      errors.push(`${validation.maxLength}文字以内で入力してください`);
    }
    if (validation.pattern != null) {
      const patternError = validatePattern(value, validation.pattern);
      if (patternError) {
        errors.push(patternError);
      }
    }
  }

  // 数値バリデーション
  if (typeof value === "number") {
    if (validation.min != null && value < validation.min) {
      errors.push(`${validation.min}以上の値を入力してください`);
    }
    if (validation.max != null && value > validation.max) {
      errors.push(`${validation.max}以下の値を入力してください`);
    }
  }

  // 配列バリデーション
  if (Array.isArray(value)) {
    if (validation.minItems != null && value.length < validation.minItems) {
      errors.push(`${validation.minItems}件以上選択してください`);
    }
    if (validation.maxItems != null && value.length > validation.maxItems) {
      errors.push(`${validation.maxItems}件以内で選択してください`);
    }
  }

  return errors;
}

/**
 * パターンバリデーション
 */
function validatePattern(value: string, pattern: string): string | null {
  switch (pattern) {
    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "有効なメールアドレスを入力してください";
      }
      break;
    }
    case "url": {
      try {
        new URL(value);
      } catch {
        return "有効なURLを入力してください";
      }
      break;
    }
    case "tel": {
      const telRegex = /^[\d\-+()]+$/;
      if (!telRegex.test(value)) {
        return "有効な電話番号を入力してください";
      }
      break;
    }
    default: {
      // カスタム正規表現
      try {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          return "入力形式が正しくありません";
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
