# Spec v2 Draft

specloom v2 の TypeSpec DSL / CompiledSpec 草案。

## Goals

- TypeSpec を authoring DSL として使う
- runtime は compiled JSON / CompiledSpec を読む
- REST/API の意味と admin UI の意味を分離する
- 軽量 CRUD DSL を起点にしつつ、relation・nested・action・validation を拡張可能にする

## Design Principles

### 1. `@resource` は TypeSpec.Rest を使う

REST resource の宣言は `@typespec/rest` の既存 decorator を使う。
specloom 側では別名を作らない。

### 2. Admin UI の意味は `@entity` から始める

管理画面 metadata は `@entity`, `@field`, `@relation`, `@pageAction`, `@rowAction` などの独自 decorator に寄せる。

### 3. 標準 validation は TypeSpec 標準に寄せる

以下は TypeSpec 標準を優先する。

- `@key`
- `@minLength`
- `@maxLength`
- `@pattern`
- `@minValue`
- `@maxValue`
- `@minItems`
- `@maxItems`

条件付きや cross-field ルールだけ specloom 独自で持つ。

### 4. action の API 情報は operation から取る

v1 の `api: { path, method, body, ... }` は持たない。
`@pageAction` / `@rowAction` は実際の `op` に付け、HTTP method / path / input / output は TypeSpec 本体から取る。

### 5. client override は stable key + extension で行う

client 側の override key は path 形式にする。

- `User.form.email`
- `User.form.section.basic`
- `User.list.action.exportCsv`
- `User.list.rowAction.suspend`

`client` は namespaced extension 用の escape hatch として残す。

## Core Decorators

| Decorator | 対象 | 用途 |
|---|---|---|
| `@entity` | `model` | 管理画面 resource metadata |
| `@field` | `property` | field の表示/入力 metadata |
| `@index` | `model` | 一覧全体の設定 |
| `@filter` | `property` | field を filter 項目として公開 |
| `@namedFilter` | `model` | 一覧の preset filter |
| `@relation` | `property` | relation の表示/入力/送信 metadata |
| `@nested` | `property` | owned child を親フォーム内で inline 編集 |
| `@section` | `model` | form/show の grouping |
| `@hidden` | `property` | 自動生成対象から除外 |
| `@computed` | `property` | list/show 用の計算フィールド |
| `@createOnly` | `property` | create 時のみ編集可能 |
| `@options` | `property` | static options |
| `@optionSource` | `property` | relation 以外の候補取得 |
| `@pageAction` | `op` | list/show/form に出す action |
| `@rowAction` | `op` | list の各行に出す action |
| `@visibleWhen` | `property` | 条件付き表示 |
| `@requiredWhen` | `property` | 条件付き必須 |
| `@readonlyWhen` | `property` | 条件付き readonly |
| `@disabledWhen` | `property` / `op` | 条件付き disabled |
| `@match` | `property` | 他 field との一致 |
| `@rule` | `model` | cross-field / mode-aware rule |

## Decorator Shapes

### `@entity`

```ts
@entity({
  label: string,
  pluralLabel?: string,
  titleField?: string,
  pageSize?: number,
  defaultSort?: { field: string, direction: "asc" | "desc" },
  views?: {
    list?: { enabled?: boolean },
    form?: { enabled?: boolean },
    show?: { enabled?: boolean }
  }
})
```

### `@field`

```ts
@field({
  label?: string,
  widget?: string,
  appearance?: string,
  section?: string,
  order?: number,
  list?: boolean,
  show?: boolean,
  form?: boolean,
  readonly?: boolean,
  placeholder?: string,
  help?: string,
  defaultValue?: unknown,
  format?: string,
  emptyText?: string,
  display?: {
    list?: {
      field?: string,
      template?: string
    },
    show?: {
      field?: string,
      template?: string
    }
  },
  placement?: {
    list?: string,
    show?: string,
    form?: string
  },
  client?: Record<string, unknown>
})
```

### `@index`

```ts
@index({
  columns?: Array<
    string |
    {
      field: string,
      label?: string,
      template?: string,
      sortable?: boolean,
      order?: number,
      placement?: string
    }
  >,
  searchable?: string[],
  sortable?: string[],
  defaultSort?: { field: string, direction: "asc" | "desc" },
  selection?: "none" | "single" | "multi",
  clickAction?: "none" | "show" | "edit"
})
```

### `@filter`

```ts
@filter(
  operators?:
    | string[]
    | {
        operators?: string[],
        widget?: string,
        order?: number,
        placement?: "toolbar" | "advanced",
        defaultValue?: unknown
      }
)
```

### `@namedFilter`

```ts
@namedFilter(id, {
  label: string,
  order?: number,
  where: FilterExpression
})
```

### `@relation`

```ts
@relation(Resource, {
  kind?: "belongsTo" | "hasOne" | "hasMany" | "manyToMany",
  cardinality?: "one" | "many",
  labelField: string,
  valueField?: string,
  submitField?: string,
  searchFields?: string[],
  lookupResource?: string,
  lookupOp?: string,
  linkTo?: "show" | "edit" | "none",
  creatable?: boolean,
  client?: Record<string, unknown>
})
```

### `@nested`

```ts
@nested(Resource, {
  cardinality?: "one" | "many",
  minItems?: number,
  maxItems?: number,
  widget?: "inline-form" | "table" | "cards"
})
```

### `@section`

```ts
@section(id, {
  label: string,
  order?: number,
  view?: "form" | "show",
  placement?: string,
  collapsible?: boolean,
  defaultCollapsed?: boolean
})
```

### `@pageAction`

```ts
@pageAction(Resource, {
  id: string,
  view: "list" | "show" | "form",
  label: string,
  placement?: string,
  order?: number,
  icon?: string,
  prominence?: "primary" | "secondary" | "subtle" | "danger",
  confirmMessage?: string,
  selection?: "none" | "selected" | "query",
  args?: Record<string, unknown>,
  input?: Model,
  when?: string,
  disabledWhen?: string,
  client?: Record<string, unknown>
})
```

### `@rowAction`

```ts
@rowAction(Resource, {
  id: string,
  view?: "list",
  label: string,
  placement?: string,
  order?: number,
  icon?: string,
  prominence?: "primary" | "secondary" | "subtle" | "danger",
  confirmMessage?: string,
  args?: Record<string, unknown>,
  input?: Model,
  when?: string,
  disabledWhen?: string,
  client?: Record<string, unknown>
})
```

### `@optionSource`

```ts
@optionSource({
  resource?: string,
  op?: string,
  labelField: string,
  valueField: string,
  searchFields?: string[]
})
```

### `FilterExpression`

```ts
type FilterExpression =
  | FilterCondition
  | { and: FilterExpression[] }
  | { or: FilterExpression[] }
  | { not: FilterExpression };

interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value:
    | string
    | number
    | boolean
    | null
    | string[]
    | number[]
    | boolean[]
    | { context: string }
    | { relative: string };
}
```

## Validation Policy

### TypeSpec Standard

単項 validation は TypeSpec 標準を使う。

- 文字数
- 数値範囲
- 配列件数
- pattern

### specloom Field-level

UI / runtime 文脈に依存するものは specloom 独自で扱う。

- `@visibleWhen(expr)`
- `@requiredWhen(expr)`
- `@readonlyWhen(expr)`
- `@disabledWhen(expr)`
- `@match(fieldName)`

### specloom Model-level

cross-field validation は `@rule(...)` に寄せる。

```ts
@rule({ kind: "requireOneOf", fields: ["email", "phone"] })
@rule({ kind: "comparison", left: "startDate", operator: "<=", right: "endDate" })
@rule({ kind: "requiredIf", field: "reason", when: "status == 'inactive'" })
```

runtime 上の固定ルールは以下。

- `visible == false` の field は validation 対象外
- `disabled == true` の field は validation 対象外
- `readonly == true` の field は submit 対象外
- nested は子まで再帰 validation する
- nested の正式サポートは 3 段まで

## v1 Features: Keep / Replace / Drop

| 項目 | v2判断 | 方針 |
|---|---|---|
| filter | replace | 概念は残すが、特殊文字列 `@relative(...)` / `@context.*` は typed reference に寄せる |
| action dialog/api | replace | `api` object は廃止。dialog は action input model から生成する |
| computed | keep | list/show 可、form 既定除外 |
| createOnly | keep | create/edit で field の編集可否を分ける |
| options | keep | static options は `@options` を維持する |
| requiredOneOf | replace | `@rule({ kind: "requireOneOf", ... })` に統合 |
| nested auto generation | keep | child form view 優先、なければ editable field 自動抽出 |
| submit spec | replace | 型だけでなく `field/relation submit metadata` と input model を基準にする |

## Example

```typespec
import "@typespec/http";
import "@typespec/rest";
import "@acme/typespec-admin-ui";

using TypeSpec.Http;
using TypeSpec.Rest;
using Acme.AdminUI;

@resource("users")
@entity(#{
  label: "ユーザー",
  pluralLabel: "ユーザー一覧",
  titleField: "name",
  defaultSort: #{ field: "name", direction: "asc" }
})
@index(#{
  columns: #[
    "id",
    "name",
    #{
      field: "email",
      label: "連絡先",
      template: "{name} <{email}>"
    },
    "departmentId"
  ],
  searchable: ["name", "email"],
  sortable: ["name", "email", "createdAt"],
  defaultSort: #{ field: "name", direction: "asc" },
  selection: "multi",
  clickAction: "show"
})
@namedFilter("all", #{
  label: "すべて",
  order: 10,
  where: #{}
})
@namedFilter("mine", #{
  label: "自分の担当",
  order: 20,
  where: #{
    field: "ownerId",
    operator: "eq",
    value: #{ context: "user.id" }
  }
})
model User {
  @key
  @field(#{
    label: "ID",
    widget: "text",
    list: true,
    show: true,
    form: false,
    readonly: true,
    order: 10
  })
  id: string;

  @field(#{
    label: "氏名",
    widget: "text",
    appearance: "text",
    section: "basic",
    list: true,
    form: true,
    order: 20,
    placeholder: "氏名を入力"
  })
  @filter(["eq", "contains"])
  @minLength(1)
  @maxLength(100)
  name: string;

  @field(#{
    label: "メール",
    widget: "email",
    appearance: "link",
    section: "basic",
    list: true,
    form: true,
    order: 30,
    format: "email"
  })
  @filter({
    operators: ["eq", "contains"],
    placement: "advanced",
    order: 20
  })
  @pattern(".+\\@.+\\..+")
  email: string;

  @field(#{
    label: "状態",
    widget: "select",
    appearance: "badge",
    list: true,
    form: true,
    order: 35
  })
  @options(#[
    #{ value: "active", label: "有効" },
    #{ value: "inactive", label: "無効" }
  ])
  @filter({
    operators: ["eq", "in"],
    placement: "toolbar",
    order: 10
  })
  status: string;

  @field(#{
    label: "部署",
    widget: "autocomplete",
    appearance: "link",
    section: "organization",
    form: true,
    list: true,
    order: 40,
    emptyText: "未所属"
  })
  @relation(Department, #{
    kind: "belongsTo",
    cardinality: "one",
    labelField: "name",
    valueField: "id",
    submitField: "departmentId",
    searchFields: ["name"],
    linkTo: "show"
  })
  departmentId?: string;

  @field(#{
    label: "初期パスワード",
    widget: "password",
    section: "security",
    form: true,
    order: 50
  })
  @createOnly
  password?: string;

  @field(#{
    label: "表示名",
    list: true,
    show: true,
    readonly: true,
    order: 60
  })
  @computed
  displayName: string;
}

@section("basic", #{ label: "基本情報", order: 10, view: "form" })
@section("organization", #{ label: "所属", order: 20, view: "form" })
@section("security", #{ label: "認証", order: 30, view: "form" })
model UserSections {}

@get
@route("/users")
@pageAction(User, #{
  id: "exportCsv",
  view: "list",
  label: "CSV出力",
  placement: "toolbar.secondary",
  order: 20,
  icon: "download",
  prominence: "secondary"
})
op exportCsv(): bytes;

@post
@route("/users/{id}/suspend")
@rowAction(User, #{
  id: "suspend",
  label: "停止",
  placement: "menu",
  order: 30,
  icon: "pause",
  prominence: "danger",
  when: "status == 'active'",
  args: #{ id: #{ fromRow: "id" } }
})
op suspend(@path id: string): User;
```

```typespec
model OrderItem {
  @field({ label: "商品", widget: "autocomplete" })
  @relation(Product, #{ labelField: "name", valueField: "id", submitField: "productId" })
  productId: string;

  @field({ label: "数量", widget: "number" })
  @minValue(1)
  quantity: int32;
}

@resource("orders")
@entity(#{ label: "注文" })
model Order {
  @field({ label: "明細", widget: "inline-form", form: true })
  @nested(OrderItem, #{ cardinality: "many", minItems: 1, maxItems: 50, widget: "table" })
  items: OrderItem[];
}
```

## Non-goals

v2 spec では以下を直接持たない。

- raw CSS / className
- framework 固有 props
- ピクセル単位のレイアウト
- action 用の `api.path` / `api.method` 二重定義

spec は semantic slot と metadata までを持ち、描画の詳細は client 側に任せる。
