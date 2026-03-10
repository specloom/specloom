import type { SpecloomTranslations } from "./types.js";

/** Default Japanese translations. */
export const jaTranslations: SpecloomTranslations = {
  "form.title.create": "新規{label}",
  "form.title.edit": "{label}を編集",
  "form.submit.create": "作成",
  "form.submit.edit": "保存",
  "form.cancel": "キャンセル",
  "form.unsavedChanges": "未保存の変更があります",
  "form.validationFailed": "入力内容にエラーがあります",
  "form.recordNotFound": "レコードが見つかりません: {id}",

  "list.recordCount": "{count}件",
  "list.newButton": "新規登録",
  "list.searchPlaceholder": "検索...",
  "list.loading": "一覧を更新中...",
  "list.filterAll": "すべて",
  "list.openColumn": "操作",
  "list.actionsColumn": "アクション",
  "list.selectAll": "表示中の行をすべて選択",
  "list.selectRow": "行を選択",
  "list.action.view": "表示",
  "list.action.edit": "編集",
  "list.selectedCount": "({count}件選択中)",
  "list.pagination.previous": "前へ",
  "list.pagination.next": "次へ",
  "list.pagination.pageSize": "表示件数",
  "list.pagination.summary": "{from}-{to} / {total}件",

  "show.title": "{label}: {id}",
  "show.editButton": "編集",
  "show.recordNotFound": "レコードが見つかりません: {id}",

  "common.backPrefix": "←",
};
