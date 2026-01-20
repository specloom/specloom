// ============================================================
// FormVM - Form ViewModel 操作関数
// ============================================================

import type { FormViewModel, FormFieldVM, ActionVM } from "./types.js";

export const FormVM = {
  // ============================================================
  // フィールド
  // ============================================================
  fields: (vm: FormViewModel) => vm.fields,
  field: (vm: FormViewModel, name: string) => vm.fields.find((f) => f.name === name),
  visibleFields: (vm: FormViewModel) => vm.fields.filter((f) => f.visible !== false),
  requiredFields: (vm: FormViewModel) => vm.fields.filter((f) => f.required),
  readonlyFields: (vm: FormViewModel) => vm.fields.filter((f) => f.readonly),

  // ============================================================
  // 値
  // ============================================================
  value: (vm: FormViewModel, name: string) => vm.fields.find((f) => f.name === name)?.value,
  values: (vm: FormViewModel): Record<string, unknown> =>
    vm.fields.reduce(
      (acc, f) => {
        acc[f.name] = f.value;
        return acc;
      },
      {} as Record<string, unknown>
    ),

  // ============================================================
  // バリデーション
  // ============================================================
  valid: (vm: FormViewModel) => vm.isValid,
  dirty: (vm: FormViewModel) => vm.isDirty,
  errors: (vm: FormViewModel): Array<{ field: string; errors: string[] }> =>
    vm.fields.filter((f) => f.errors.length > 0).map((f) => ({ field: f.name, errors: f.errors })),
  fieldErrors: (vm: FormViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.errors ?? [],
  hasError: (vm: FormViewModel, name: string) =>
    (vm.fields.find((f) => f.name === name)?.errors.length ?? 0) > 0,
  hasErrors: (vm: FormViewModel) => vm.fields.some((f) => f.errors.length > 0),
  fieldsWithErrors: (vm: FormViewModel) => vm.fields.filter((f) => f.errors.length > 0),

  // ============================================================
  // フィールド属性
  // ============================================================
  hint: (vm: FormViewModel, name: string) => vm.fields.find((f) => f.name === name)?.hint,
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
};
