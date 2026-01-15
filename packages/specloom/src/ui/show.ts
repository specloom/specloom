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
};
