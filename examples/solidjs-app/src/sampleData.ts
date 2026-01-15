import type { ListViewModel, FormViewModel, ShowViewModel } from "specloom";

// ============================================================
// Sample ListViewModel
// ============================================================

export const sampleListVM: ListViewModel = {
  type: "list",
  resource: "Article",
  label: "記事一覧",
  fields: [
    { name: "title", label: "タイトル", kind: "text", sortable: true },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
    },
    {
      name: "author",
      label: "著者",
      kind: "relation",
      relation: { resource: "User", labelField: "name" },
    },
    { name: "createdAt", label: "作成日", kind: "date", sortable: true },
  ],
  headerActions: [
    { id: "create", label: "新規作成", allowed: true, ui: { variant: "primary" } },
  ],
  bulkActions: [
    {
      id: "bulkDelete",
      label: "一括削除",
      allowed: true,
      confirm: "選択した記事を削除しますか？",
      ui: { variant: "danger" },
    },
  ],
  rows: [
    {
      id: "1",
      values: {
        title: "はじめての記事",
        status: "published",
        author: { id: "u1", name: "田中太郎" },
        createdAt: "2024-01-15",
      },
      actions: [
        { id: "edit", label: "編集", allowed: true },
        {
          id: "delete",
          label: "削除",
          allowed: true,
          confirm: "この記事を削除しますか？",
          ui: { variant: "danger" },
        },
      ],
    },
    {
      id: "2",
      values: {
        title: "下書き記事",
        status: "draft",
        author: { id: "u2", name: "山田花子" },
        createdAt: "2024-01-20",
      },
      actions: [
        { id: "edit", label: "編集", allowed: true },
        { id: "publish", label: "公開", allowed: true, ui: { variant: "primary" } },
        { id: "delete", label: "削除", allowed: false, ui: { variant: "danger" } },
      ],
    },
    {
      id: "3",
      values: {
        title: "技術ブログ",
        status: "published",
        author: { id: "u1", name: "田中太郎" },
        createdAt: "2024-02-01",
      },
      actions: [
        { id: "edit", label: "編集", allowed: true },
        {
          id: "delete",
          label: "削除",
          allowed: true,
          confirm: "この記事を削除しますか？",
          ui: { variant: "danger" },
        },
      ],
    },
  ],
  filters: {
    named: [
      { id: "all", label: "すべて", active: true },
      { id: "published", label: "公開中", active: false },
      { id: "draft", label: "下書き", active: false },
    ],
  },
  selection: { mode: "multi", selected: [] },
  search: { fields: ["title"], query: "" },
  defaultSort: { field: "createdAt", order: "desc" },
};

// ============================================================
// Sample FormViewModel
// ============================================================

export const sampleFormVM: FormViewModel = {
  type: "form",
  resource: "Article",
  label: "記事",
  mode: "edit",
  id: "1",
  fields: [
    {
      name: "title",
      label: "タイトル",
      kind: "text",
      value: "はじめての記事",
      required: true,
      readonly: false,
      validation: { maxLength: 100 },
      errors: [],
    },
    {
      name: "content",
      label: "本文",
      kind: "longText",
      value: "これは記事の本文です。",
      required: true,
      readonly: false,
      errors: [],
    },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "published",
      required: true,
      readonly: false,
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
      errors: [],
    },
    {
      name: "featured",
      label: "おすすめ",
      kind: "boolean",
      value: false,
      required: false,
      readonly: false,
      errors: [],
    },
    {
      name: "viewCount",
      label: "閲覧数",
      kind: "number",
      value: 123,
      required: false,
      readonly: true,
      errors: [],
    },
  ],
  actions: [
    { id: "save", label: "保存", allowed: true, ui: { variant: "primary" } },
    { id: "cancel", label: "キャンセル", allowed: true },
  ],
  isValid: true,
  isDirty: false,
};

// ============================================================
// Sample ShowViewModel
// ============================================================

export const sampleShowVM: ShowViewModel = {
  type: "show",
  resource: "Article",
  label: "記事詳細",
  id: "1",
  fields: [
    { name: "title", label: "タイトル", kind: "text", value: "はじめての記事" },
    { name: "content", label: "本文", kind: "longText", value: "これは記事の本文です。" },
    {
      name: "status",
      label: "状態",
      kind: "enum",
      value: "published",
      options: [
        { value: "draft", label: "下書き" },
        { value: "published", label: "公開中" },
      ],
    },
    { name: "featured", label: "おすすめ", kind: "boolean", value: true },
    {
      name: "author",
      label: "著者",
      kind: "relation",
      value: { id: "u1", name: "田中太郎" },
      relation: { resource: "User", labelField: "name" },
    },
    { name: "createdAt", label: "作成日", kind: "date", value: "2024-01-15" },
  ],
  actions: [
    { id: "edit", label: "編集", allowed: true },
    { id: "delete", label: "削除", allowed: true, confirm: "この記事を削除しますか？", ui: { variant: "danger" } },
    { id: "back", label: "一覧に戻る", allowed: true },
  ],
};
