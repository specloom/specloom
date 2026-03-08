# CompiledSpec v2

TypeSpec DSL から生成される runtime 正本の JSON 仕様。
ViewModel はこの `CompiledSpec` を入力にして評価する。

## Overview

```text
TypeSpec DSL -> CompiledSpec v2 -> runtime evaluation -> ViewModel
```

- authoring は TypeSpec
- runtime は `CompiledSpec v2`
- `fields/resources` は lookup しやすい map に正規化する
- `columns/sections/actions/namedFilters` は順序が必要なので array を維持する
- `visibleWhen` などの条件式は compile 時に AST 化する

## Top-level Shape

```ts
type CompiledSpecV2 = {
  version: "2";
  resources: Record<string, CompiledResource>;
  inputs?: Record<string, CompiledInput>;
}
```

- `resources`
  - CRUD 対象 resource
- `inputs`
  - action dialog や custom create/update form 用 input model

## Normalization Rules

- `@index.columns` の文字列 shorthand は object に展開する
- `@field.section` と `@section(...)` は merge して `views.form.sections` / `views.show.sections` に正規化する
- `@entity.defaultSort` と `@index.defaultSort` は list view に正規化し、`@index` 側を優先する
- `@relation.submitField` / 型情報 / cardinality から `submit` metadata を導出する
- `@filter(["eq", "contains"])` は `{ operators: [...] }` に正規化する
- `when` / `visibleWhen` / `requiredWhen` / `readonlyWhen` / `disabledWhen` は `ExpressionAst` に変換する

## Resource Shape

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
}
```

## Input Shape

```ts
type CompiledInput = {
  name: string;
  label?: string;
  fields: Record<string, CompiledField>;
  form: {
    sections: CompiledSection[];
  };
  rules: CompiledRule[];
}
```

- action の `input` は `inputs[name]` を参照する
- resource と input は field/rule shape を共有する

## Field Shape

```ts
type CompiledField = {
  name: string;
  type: CompiledFieldType;
  key?: boolean;
  hidden?: boolean;
  computed?: boolean;
  createOnly?: boolean;
  ui: {
    label?: string;
    widget?: string;
    appearance?: string;
    section?: string;
    order?: number;
    visibleIn: {
      list: boolean;
      show: boolean;
      form: boolean;
    };
    readonly?: boolean;
    placeholder?: string;
    help?: string;
    defaultValue?: unknown;
    format?: string;
    emptyText?: string;
    display?: {
      list?: {
        field?: string;
        template?: string;
      };
      show?: {
        field?: string;
        template?: string;
      };
    };
    placement?: {
      list?: string;
      show?: string;
      form?: string;
    };
    client?: Record<string, unknown>;
  };
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minValue?: number;
    maxValue?: number;
    minItems?: number;
    maxItems?: number;
    match?: string;
  };
  rules?: {
    visibleWhen?: ExpressionAst;
    requiredWhen?: ExpressionAst;
    readonlyWhen?: ExpressionAst;
    disabledWhen?: ExpressionAst;
  };
  options?: CompiledOption[];
  optionsSource?: CompiledOptionSource;
  filter?: CompiledFilterField;
  relation?: CompiledRelation;
  nested?: CompiledNested;
  submit: CompiledSubmit;
}
```

### Field Type

```ts
type CompiledFieldType =
  | { kind: "scalar"; name: string; nullable?: boolean; array?: boolean }
  | { kind: "enum"; name: string; nullable?: boolean; array?: boolean }
  | { kind: "relation"; resource: string; cardinality: "one" | "many"; storage: "scalar" | "object" }
  | { kind: "nested"; resource: string; cardinality: "one" | "many" };
```

### Relation / Nested / Submit

```ts
type CompiledRelation = {
  resource: string;
  kind: "belongsTo" | "hasOne" | "hasMany" | "manyToMany";
  cardinality: "one" | "many";
  labelField: string;
  valueField: string;
  submitField?: string;
  searchFields?: string[];
  lookupResource?: string;
  lookupOp?: string;
  linkTo?: "show" | "edit" | "none";
  creatable?: boolean;
  client?: Record<string, unknown>;
}

type CompiledNested = {
  resource: string;
  cardinality: "one" | "many";
  minItems?: number;
  maxItems?: number;
  widget?: "inline-form" | "table" | "cards";
  maxDepth: 3;
}

type CompiledSubmit = {
  field: string;
  shape: "self" | "scalar" | "scalar[]" | "object" | "object[]";
  valueField?: string;
}

type CompiledOption = {
  value: string | number | boolean;
  label: string;
}

type CompiledOptionSource = {
  resource?: string;
  op?: string;
  labelField: string;
  valueField: string;
  searchFields?: string[];
}
```

- `relation` は既存 record の参照
- `nested` は owned child の inline 編集
- nested の正式サポートは 3 段まで

## List View Shape

```ts
type CompiledListView = {
  enabled: boolean;
  columns: CompiledColumn[];
  search?: {
    fields: string[];
  };
  sortable: string[];
  defaultSort?: {
    field: string;
    direction: "asc" | "desc";
  };
  selection: "none" | "single" | "multi";
  clickAction: "none" | "show" | "edit";
  namedFilters: CompiledNamedFilter[];
  pageActions: CompiledAction[];
  rowActions: CompiledAction[];
}

type CompiledColumn = {
  field: string;
  label: string;
  template?: string;
  sortable: boolean;
  order?: number;
  placement?: string;
}

type CompiledFilterField = {
  operators: string[];
  widget?: string;
  order?: number;
  placement?: "toolbar" | "advanced";
  defaultValue?: unknown;
}

type CompiledNamedFilter = {
  id: string;
  label: string;
  order?: number;
  where: FilterExpression;
}
```

## Form / Show View Shape

```ts
type CompiledRecordView = {
  enabled: boolean;
  sections: CompiledSection[];
  pageActions: CompiledAction[];
}

type CompiledSection = {
  id: string;
  label: string;
  view: "form" | "show";
  order?: number;
  placement?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  fields: string[];
}
```

## Action Shape

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
  operation: CompiledOperationRef;
  client?: Record<string, unknown>;
}

type CompiledOperationRef = {
  id: string;
  method: string;
  path: string;
  inputModel?: string;
  outputModel?: string;
}
```

- `api.path` / `api.method` は持たない
- action 実行契約は `operation` 参照に一本化する
- `input` がある場合は dialog/form を `inputs[input]` から生成する

## Rule / Expression Shape

```ts
type CompiledRule = {
  kind: "requireOneOf" | "comparison" | "requiredIf" | "mutuallyExclusive" | "requiredTogether";
  fields?: string[];
  field?: string;
  left?: string;
  right?: string;
  operator?: string;
  when?: ExpressionAst;
  message?: string;
}

type ExpressionAst =
  | { type: "literal"; value: string | number | boolean | null }
  | { type: "identifier"; path: string }
  | { type: "comparison"; operator: "==" | "!=" | ">" | ">=" | "<" | "<="; left: ExpressionAst; right: ExpressionAst }
  | { type: "logical"; operator: "&&" | "||"; left: ExpressionAst; right: ExpressionAst }
  | { type: "unary"; operator: "!"; operand: ExpressionAst };
```

## Filter Expression

```ts
type EmptyFilter = Record<string, never>;

type FilterExpression =
  | EmptyFilter
  | FilterCondition
  | { and: FilterExpression[] }
  | { or: FilterExpression[] }
  | { not: FilterExpression };

type FilterCondition = {
  field: string;
  operator: string;
  value: FilterValue;
}

type FilterValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | boolean[]
  | { context: string }
  | { relative: string };
```

- `@context.user.id` のような特殊文字列は使わない
- context 参照は `{ context: "user.id" }`
- 相対日付は `{ relative: "-7d" }`

## Error Path

validation error の key は `dot + bracket` 形式で統一する。

- `name`
- `departmentId`
- `address.postalCode`
- `items[0].productId`
- `items[0].taxes[1].rate`

同じ path 形式を client validation / server validation / action dialog に共通利用する。

## Example

```json
{
  "version": "2",
  "resources": {
    "User": {
      "name": "User",
      "meta": {
        "label": "ユーザー",
        "pluralLabel": "ユーザー一覧",
        "titleField": "name"
      },
      "fields": {
        "name": {
          "name": "name",
          "type": { "kind": "scalar", "name": "string" },
          "ui": {
            "label": "氏名",
            "widget": "text",
            "appearance": "text",
            "section": "basic",
            "order": 20,
            "visibleIn": { "list": true, "show": true, "form": true }
          },
          "validation": { "minLength": 1, "maxLength": 100 },
          "filter": { "operators": ["eq", "contains"] },
          "submit": { "field": "name", "shape": "self" }
        },
        "departmentId": {
          "name": "departmentId",
          "type": {
            "kind": "relation",
            "resource": "Department",
            "cardinality": "one",
            "storage": "scalar"
          },
          "ui": {
            "label": "部署",
            "widget": "autocomplete",
            "appearance": "link",
            "visibleIn": { "list": true, "show": true, "form": true }
          },
          "relation": {
            "resource": "Department",
            "kind": "belongsTo",
            "cardinality": "one",
            "labelField": "name",
            "valueField": "id",
            "submitField": "departmentId",
            "searchFields": ["name"],
            "linkTo": "show"
          },
          "submit": {
            "field": "departmentId",
            "shape": "scalar",
            "valueField": "id"
          }
        }
      },
      "views": {
        "list": {
          "enabled": true,
          "columns": [
            { "field": "name", "label": "氏名", "sortable": true },
            {
              "field": "email",
              "label": "連絡先",
              "template": "{name} <{email}>",
              "sortable": true
            }
          ],
          "search": { "fields": ["name", "email"] },
          "sortable": ["name", "email", "createdAt"],
          "selection": "multi",
          "clickAction": "show",
          "namedFilters": [
            {
              "id": "mine",
              "label": "自分の担当",
              "where": {
                "field": "ownerId",
                "operator": "eq",
                "value": { "context": "user.id" }
              }
            }
          ],
          "pageActions": [],
          "rowActions": []
        },
        "form": { "enabled": true, "sections": [], "pageActions": [] },
        "show": { "enabled": true, "sections": [], "pageActions": [] }
      },
      "rules": []
    }
  }
}
```
