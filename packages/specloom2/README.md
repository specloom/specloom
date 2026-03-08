# specloom2

Headless admin runtime for specloom spec v2.

`specloom2` は compiled spec v2 JSON を読み込み、list / show / form の ViewModel を生成するランタイムです。
TypeSpec compiler には依存せず、入力境界は `@specloom/spec` で定義される spec JSON です。

```text
spec v2 JSON -> specloom2 -> ViewModel -> UI
```

## Responsibilities

- spec v2 JSON の parse / validate
- resource / input の解決
- 条件式 AST の評価
- list / show / form ViewModel の生成
- field runtime state / validation の解決
- submit 定義に従った送信 payload のシリアライズ
- UI presentation metadata の解決

`typespec2` は compile-time 側、`specloom2` は runtime 側です。

## Quick Start

```ts
import specJson from "./spec.json";
import {
  createListVM,
  createFormVM,
  createUiResolver,
  serializeForm,
  validateForm,
  validateSpec,
} from "specloom2";

const spec = validateSpec(specJson);

const listVM = createListVM(spec, "User", {
  context: { role: "admin" },
  data: [
    {
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      status: "active",
    },
  ],
});

const formVM = createFormVM(spec, "User", {
  context: { role: "admin" },
  mode: "create",
});

const validation = validateForm({
  resource: spec.resources.User,
  values: {
    name: "Alice",
  },
});

const ui = createUiResolver({
  defaults: {
    fieldRenderers: {
      scalar: "text-input",
      enum: "select",
      "relation:one": "relation-picker",
    },
  },
});

const namePresentation = ui.field({
  resource: spec.resources.User,
  field: formVM.fields[0]!,
  view: "form",
});

const payload = serializeForm(formVM);
```

## Main APIs

### Loader

```ts
import { parseSpec, validateSpec } from "specloom2";

const spec = parseSpec(jsonString);
const spec2 = validateSpec(specJson);
```

- `parseSpec(source)` は JSON 文字列を parse + validate します
- `validateSpec(value)` は object を validate します

### Facade

```ts
import {
  createListVM,
  createShowVM,
  createFormVM,
  createInputVM,
} from "specloom2";
```

- `createListVM(spec, resourceName, options)`
- `createShowVM(spec, resourceName, options)`
- `createFormVM(spec, resourceName, options)`
- `createInputVM(spec, inputName, options)`

### Validation

```ts
import {
  resolveFieldState,
  validateField,
  validateForm,
} from "specloom2";
```

- `resolveFieldState({ field, values, context, mode })`
  `visible` / `required` / `readonly` / `disabled` を解決します
- `validateField({ resource, fieldName, values, context, mode })`
  単一フィールドのエラー配列を返します
- `validateForm({ resource, values, context, mode })`
  form 全体の `errors` と `fieldStates` を返します

`requiredWhen` / `readonlyWhen` / `disabledWhen` / `visibleWhen` を
`ExpressionAst` 経由で評価します。

### Admin

```ts
import { createAdmin } from "specloom2";

const admin = createAdmin(spec, { role: "admin" });

const listVM = admin.list("User", {
  data: rows,
});

const formVM = admin.form("User", {
  mode: "edit",
  record,
});
```

`createAdmin()` は spec と default context を束ねた薄い facade です。

### Serialize

```ts
import { serializeForm, serializeResource, serializeInput } from "specloom2";
```

- `serializeForm(formVM)` は FormViewModel から payload を生成します
- `serializeResource(resource, values)` は resource 定義と値から payload を生成します
- `serializeInput(input, values)` は input 定義と値から payload を生成します

`submit.shape` と `submit.valueField` を見て、relation や nested を送信用の shape に変換します。

### UI Presentation

```ts
import {
  createUiResolver,
  resolveFieldPresentation,
} from "specloom2";
```

- `createUiResolver(uiConfig)`
  field / action / section / column presentation resolver を返します
- `resolveFieldPresentation({ resource, field, view, ui })`
  field metadata を `renderer`, `props`, `client` 付きで正規化します

`specloom2` 自体は React / Solid / Svelte の component を持ちません。
代わりに `renderer key + props + client metadata` を返すので、各 UI 側で
registry を用意して component に解決します。

```ts
const ui = createUiResolver({
  resources: {
    User: {
      fields: {
        departmentId: {
          renderer: "department-picker",
          props: { searchable: true },
        },
      },
    },
  },
});

const presentation = ui.field({
  resource: spec.resources.User,
  field: formVM.fields.find((f) => f.name === "departmentId")!,
  view: "form",
});

// React / Solid / Svelte 側で registry から解決
const rendererKey = presentation.renderer;
```

## ViewModel Shape

生成される ViewModel の中心は次です。

- `ListViewModel`
  `columns`, `rows`, `namedFilters`, `pageActions`, `selectionActions`
- `ShowViewModel`
  `fields`, `sections`, `actions`
- `FormViewModel`
  `fields`, `sections`, `actions`, `isValid`, `isDirty`

すべての型は package root から export されます。
field VM には `ui`, `options`, `optionsSource`, `relation`, `nested`, `submit`
などの metadata も含まれます。

## Headless Usage

`specloom2` は UI framework 非依存です。
想定する利用パターンは次です。

1. spec JSON を `validateSpec()` で読み込む
2. `createListVM()` / `createFormVM()` で ViewModel を作る
3. `validateForm()` で runtime validation を行う
4. `createUiResolver()` で renderer key と UI metadata を解決する
5. React / Solid / Svelte 側の registry で component に割り当てる

```text
spec JSON -> specloom2 VM/validation/ui resolver -> framework registry -> UI
```

## Package Boundary

- `specloom2` は `@specloom/spec` を参照します
- `specloom2` は `TypeSpec` / `@typespec/compiler` に依存しません
- `specloom2` は特定 UI framework の component には依存しません
- spec の producer は問いません
  `typespec2` でも、別の compiler でも、v2 JSON を出せれば読めます

## Development

```bash
pnpm --filter specloom2 build
pnpm --filter specloom2 test
pnpm --filter specloom2 typecheck
```

## Source Layout

```text
src/
  admin/        # spec + context を束ねる facade
  evaluator/    # list/show/form VM の生成
  expression/   # ExpressionAst の評価
  facade/       # resourceName/inputName から直接 VM 生成
  loader/       # parse / validate
  resolver/     # resource / input / field 解決
  serialize/    # submit 仕様に従う payload 生成
  ui/           # renderer key / UI metadata 解決
  validation/   # field state / form validation
  vm/           # ViewModel 型
```
