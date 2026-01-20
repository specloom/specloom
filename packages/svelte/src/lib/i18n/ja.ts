/**
 * Japanese labels for specloom Svelte components
 */
export const ja = {
  // List
  actions: "操作",
  noData: "データがありません",

  // Form
  selectPlaceholder: "選択してください",
  required: "*",

  // Show (boolean display)
  yes: "はい",
  no: "いいえ",
  empty: "-",
} as const;

export type Labels = typeof ja;
