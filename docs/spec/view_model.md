# ViewModel Spec

`specloom` が出力する評価済み ViewModel の概要です。

## ListViewModel

```ts
type ListViewModel = {
  type: "list";
  resource: string;
  label: string;
  columns: ListColumnVM[];
  rows: ListRowVM[];
  filters: ListFilterVM[];
  namedFilters: NamedFilterVM[];
  search: {
    fields: string[];
    query: string;
  };
  selection: {
    mode: "none" | "single" | "multi";
    selected: string[];
  };
  pageActions: ActionVM[];
  selectionActions: ActionVM[];
  defaultSort?: { field: string; direction: "asc" | "desc" };
  currentSort?: { field: string; direction: "asc" | "desc" };
  clickAction: "none" | "show" | "edit";
};
```

## ShowViewModel

```ts
type ShowViewModel = {
  type: "show";
  resource: string;
  label: string;
  id: string;
  fields: ShowFieldVM[];
  sections: RecordSectionVM<ShowFieldVM>[];
  actions: ActionVM[];
};
```

## FormViewModel

```ts
type FormViewModel = {
  type: "form";
  resource: string;
  label: string;
  mode: "create" | "edit";
  id?: string;
  fields: FormFieldVM[];
  sections: RecordSectionVM<FormFieldVM>[];
  actions: ActionVM[];
  isValid: boolean;
  isDirty: boolean;
};
```

## Notes

- ViewModel は state を持ちません。
- UI 側の状態操作は `createFormState` / `createInputState` / `createListState` を使います。
- 表示 component の選択は `createUiResolver` で解決します。
