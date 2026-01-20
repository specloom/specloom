// ============================================================
// FormVM - Form ViewModel 操作関数
// ============================================================

import type { FormViewModel, FormFieldVM, ActionVM } from "./types.js";
import { validateField } from "../validation/index.js";
import type { Field, FieldType } from "../spec/index.js";

export const FormVM = {
  // ============================================================
  // フィールド
  // ============================================================
  fields: (vm: FormViewModel) => vm.fields,
  field: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name),
  visibleFields: (vm: FormViewModel) =>
    vm.fields.filter((f) => f.visible !== false),
  requiredFields: (vm: FormViewModel) => vm.fields.filter((f) => f.required),
  readonlyFields: (vm: FormViewModel) => vm.fields.filter((f) => f.readonly),

  // ============================================================
  // 値
  // ============================================================
  value: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.value,
  values: (vm: FormViewModel): Record<string, unknown> =>
    vm.fields.reduce(
      (acc, f) => {
        acc[f.name] = f.value;
        return acc;
      },
      {} as Record<string, unknown>,
    ),

  // ============================================================
  // バリデーション
  // ============================================================
  valid: (vm: FormViewModel) => vm.isValid,
  dirty: (vm: FormViewModel) => vm.isDirty,
  errors: (vm: FormViewModel): Array<{ field: string; errors: string[] }> =>
    vm.fields
      .filter((f) => f.errors.length > 0)
      .map((f) => ({ field: f.name, errors: f.errors })),
  fieldErrors: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.errors ?? [],
  hasError: (vm: FormViewModel, name: string) =>
    (vm.fields.find((f) => f.name === name)?.errors.length ?? 0) > 0,
  hasErrors: (vm: FormViewModel) => vm.fields.some((f) => f.errors.length > 0),
  fieldsWithErrors: (vm: FormViewModel) =>
    vm.fields.filter((f) => f.errors.length > 0),

  // ============================================================
  // フィールド属性
  // ============================================================
  hint: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.hint,
  placeholder: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.placeholder,
  visible: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.visible !== false,
  required: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.required ?? false,
  readonly: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.readonly ?? false,

  // ============================================================
  // グループ
  // ============================================================
  groups: (vm: FormViewModel) => vm.groups ?? [],
  fieldsInGroup: (vm: FormViewModel, groupId: string) => {
    const group = vm.groups?.find((g) => g.id === groupId);
    if (!group) return [];
    return vm.fields.filter((f) => group.fields.includes(f.name));
  },

  // ============================================================
  // アクション
  // ============================================================
  actions: (vm: FormViewModel) => vm.actions,
  allowedActions: (vm: FormViewModel) => vm.actions.filter((a) => a.allowed),
  canSubmit: (vm: FormViewModel) => vm.isValid && !vm.isSubmitting,

  // ============================================================
  // 状態
  // ============================================================
  loading: (vm: FormViewModel) => vm.isLoading ?? false,
  submitting: (vm: FormViewModel) => vm.isSubmitting ?? false,
  error: (vm: FormViewModel) => vm.error,

  // ============================================================
  // メタ
  // ============================================================
  label: (vm: FormViewModel) => vm.label,
  resource: (vm: FormViewModel) => vm.resource,
  mode: (vm: FormViewModel) => vm.mode,
  id: (vm: FormViewModel) => vm.id,

  // ============================================================
  // 状態更新（イミュータブル）
  // ============================================================

  /** フィールド値を更新 */
  setValue: (
    vm: FormViewModel,
    name: string,
    value: unknown,
  ): FormViewModel => ({
    ...vm,
    isDirty: true,
    fields: vm.fields.map((f) => (f.name === name ? { ...f, value } : f)),
  }),

  /** 複数フィールド値を一括更新 */
  setValues: (
    vm: FormViewModel,
    values: Record<string, unknown>,
  ): FormViewModel => ({
    ...vm,
    isDirty: true,
    fields: vm.fields.map((f) =>
      f.name in values ? { ...f, value: values[f.name] } : f,
    ),
  }),

  /** フィールドエラーを設定 */
  setFieldErrors: (
    vm: FormViewModel,
    name: string,
    errors: string[],
  ): FormViewModel => {
    const newFields = vm.fields.map((f) =>
      f.name === name ? { ...f, errors } : f,
    );
    return {
      ...vm,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    };
  },

  /** 全フィールドのエラーをクリア */
  clearErrors: (vm: FormViewModel): FormViewModel => ({
    ...vm,
    fields: vm.fields.map((f) => ({ ...f, errors: [] })),
    isValid: true,
  }),

  /** 全エラーを一括設定 */
  setAllErrors: (
    vm: FormViewModel,
    errors: Record<string, string[]>,
  ): FormViewModel => {
    const newFields = vm.fields.map((f) => ({
      ...f,
      errors: errors[f.name] ?? [],
    }));
    return {
      ...vm,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    };
  },

  /** フォーム全体をバリデーション */
  validate: (vm: FormViewModel): FormViewModel => {
    const newFields = vm.fields.map((f) => {
      const field: Field = {
        name: f.name,
        type: f.kind as FieldType,
        label: f.label,
        kind: f.kind,
        required: f.required,
        validation: f.validation,
      };
      const errors = validateField(field, f.value);
      return { ...f, errors };
    });
    return {
      ...vm,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    };
  },

  /** 単一フィールドをバリデーション */
  validateField: (vm: FormViewModel, name: string): FormViewModel => {
    const newFields = vm.fields.map((f) => {
      if (f.name !== name) return f;
      const field: Field = {
        name: f.name,
        type: f.kind as FieldType,
        label: f.label,
        kind: f.kind,
        required: f.required,
        validation: f.validation,
      };
      const errors = validateField(field, f.value);
      return { ...f, errors };
    });
    return {
      ...vm,
      fields: newFields,
      isValid: newFields.every((f) => f.errors.length === 0),
    };
  },

  /** 送信中状態を設定 */
  setSubmitting: (vm: FormViewModel, isSubmitting: boolean): FormViewModel => ({
    ...vm,
    isSubmitting,
  }),

  /** ローディング状態を設定 */
  setLoading: (vm: FormViewModel, isLoading: boolean): FormViewModel => ({
    ...vm,
    isLoading,
  }),

  /** エラーを設定 */
  setError: (vm: FormViewModel, error: string | undefined): FormViewModel => ({
    ...vm,
    error,
  }),

  /** フォームをリセット（初期値に戻す） */
  reset: (
    vm: FormViewModel,
    initialValues?: Record<string, unknown>,
  ): FormViewModel => ({
    ...vm,
    isDirty: false,
    isValid: true,
    fields: vm.fields.map((f) => ({
      ...f,
      value: initialValues?.[f.name] ?? f.value,
      errors: [],
    })),
  }),

  /** dirty状態をクリア */
  markClean: (vm: FormViewModel): FormViewModel => ({
    ...vm,
    isDirty: false,
  }),
};
