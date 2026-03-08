# Compiled Spec v1

TypeSpec から生成される runtime 正本の JSON 仕様です。

## Overview

```text
TypeSpec -> compiled spec v1 -> specloom runtime -> state / validation / VM / helpers
```

## Top-Level Shape

```ts
type CompiledSpec = {
  version: "1";
  resources: Record<string, CompiledResource>;
  inputs?: Record<string, CompiledInput>;
};
```

## Resource

```ts
type CompiledResource = {
  name: string;
  meta: {
    label: string;
    pluralLabel?: string;
    titleField?: string;
    pageSize?: number;
    client?: Record<string, unknown>;
  };
  fields: Record<string, CompiledField>;
  views: {
    list: CompiledListView;
    form: CompiledRecordView;
    show: CompiledRecordView;
  };
  rules: CompiledRule[];
};
```

## Input

```ts
type CompiledInput = {
  name: string;
  label?: string;
  fields: Record<string, CompiledField>;
  form: {
    sections: CompiledSection[];
  };
  rules: CompiledRule[];
};
```

## Field

```ts
type CompiledField = {
  name: string;
  type: CompiledFieldType;
  key?: boolean;
  hidden?: boolean;
  computed?: boolean;
  createOnly?: boolean;
  ui: CompiledFieldUi;
  validation?: CompiledFieldValidation;
  rules?: CompiledFieldRules;
  options?: CompiledOption[];
  optionsSource?: CompiledOptionSource;
  filter?: CompiledFieldFilter;
  relation?: CompiledRelation;
  nested?: CompiledNested;
  submit: CompiledFieldSubmit;
};
```

### Validation

```ts
type CompiledFieldValidation = {
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minItems?: number;
  maxItems?: number;
  match?: string;
};
```

### Conditional Rules

```ts
type CompiledFieldRules = {
  visibleWhen?: ExpressionAst;
  requiredWhen?: ExpressionAst;
  readonlyWhen?: ExpressionAst;
  disabledWhen?: ExpressionAst;
};
```

## List View

```ts
type CompiledListView = {
  enabled: boolean;
  columns: CompiledColumn[];
  search?: { fields: string[] };
  sortable: string[];
  defaultSort?: { field: string; direction: "asc" | "desc" };
  selection: "none" | "single" | "multi";
  clickAction: "none" | "show" | "edit";
  namedFilters: CompiledNamedFilter[];
  pageActions: CompiledAction[];
  rowActions: CompiledAction[];
};
```

## Record View

```ts
type CompiledRecordView = {
  enabled: boolean;
  sections: CompiledSection[];
  pageActions: CompiledAction[];
};
```

## Action

```ts
type CompiledAction = {
  id: string;
  kind: "page" | "row";
  view: "list" | "show" | "form";
  resource: string;
  label: string;
  placement?: string;
  order?: number;
  icon?: string;
  prominence?: "primary" | "secondary" | "subtle" | "danger";
  confirmMessage?: string;
  selection?: "none" | "selected" | "query";
  args?: Record<string, unknown>;
  input?: string;
  when?: ExpressionAst;
  disabledWhen?: ExpressionAst;
  operation: {
    id: string;
    method: string;
    path: string;
    inputModel?: string;
    outputModel?: string;
  };
  client?: Record<string, unknown>;
};
```

## Model-Level Rules

```ts
type CompiledRule = {
  kind:
    | "requireOneOf"
    | "comparison"
    | "requiredIf"
    | "mutuallyExclusive"
    | "requiredTogether";
  fields?: string[];
  field?: string;
  left?: string;
  right?: string;
  operator?: string;
  when?: ExpressionAst;
  message?: string;
};
```

## Runtime Consumers

compiled spec v1 は次の API で使われます。

- `validateSpec`
- `createFormState`, `createInputState`, `createListState`
- `createListVM`, `createShowVM`, `createFormVM`, `createInputVM`
- `validateForm`
- `serializeResource`, `serializeInput`
- `createOptionsResolver`
- `createUiResolver`
