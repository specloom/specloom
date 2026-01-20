// ============================================================
// ShowVM - Show ViewModel 操作関数
// ============================================================

import type { ShowViewModel, ShowFieldVM, ActionVM } from "./types.js";
import { Format, type FormatOptions } from "../format/index.js";

export const ShowVM = {
  // ============================================================
  // フィールド
  // ============================================================
  fields: (vm: ShowViewModel) => vm.fields,
  field: (vm: ShowViewModel, name: string) =>
    vm.fields.find((f) => f.name === name),

  // ============================================================
  // 値
  // ============================================================
  value: (vm: ShowViewModel, name: string) =>
    vm.fields.find((f) => f.name === name)?.value,
  formatValue: (
    field: ShowFieldVM,
    value: unknown,
    options?: FormatOptions,
  ): string => Format.field(value, field, options),

  // ============================================================
  // グループ
  // ============================================================
  groups: (vm: ShowViewModel) => vm.groups ?? [],
  fieldsInGroup: (vm: ShowViewModel, groupId: string) => {
    const group = vm.groups?.find((g) => g.id === groupId);
    if (!group) return [];
    return vm.fields.filter((f) => group.fields.includes(f.name));
  },

  // ============================================================
  // アクション
  // ============================================================
  actions: (vm: ShowViewModel) => vm.actions,
  allowedActions: (vm: ShowViewModel) => vm.actions.filter((a) => a.allowed),

  // ============================================================
  // 状態
  // ============================================================
  loading: (vm: ShowViewModel) => vm.isLoading ?? false,
  error: (vm: ShowViewModel) => vm.error,

  // ============================================================
  // メタ
  // ============================================================
  label: (vm: ShowViewModel) => vm.label,
  resource: (vm: ShowViewModel) => vm.resource,
  id: (vm: ShowViewModel) => vm.id,

  // ============================================================
  // 状態更新（イミュータブル）
  // ============================================================

  /** ローディング状態を設定 */
  setLoading: (vm: ShowViewModel, isLoading: boolean): ShowViewModel => ({
    ...vm,
    isLoading,
  }),

  /** エラーを設定 */
  setError: (vm: ShowViewModel, error: string | undefined): ShowViewModel => ({
    ...vm,
    error,
  }),

  /** フィールドデータを更新 */
  setData: (
    vm: ShowViewModel,
    data: Record<string, unknown>,
  ): ShowViewModel => ({
    ...vm,
    fields: vm.fields.map((f) => ({
      ...f,
      value: f.name in data ? data[f.name] : f.value,
    })),
  }),

  /** 単一フィールド値を更新 */
  setFieldValue: (
    vm: ShowViewModel,
    name: string,
    value: unknown,
  ): ShowViewModel => ({
    ...vm,
    fields: vm.fields.map((f) => (f.name === name ? { ...f, value } : f)),
  }),

  /** IDを更新 */
  setId: (vm: ShowViewModel, id: string): ShowViewModel => ({
    ...vm,
    id,
  }),
};
