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
- submit 定義に従った送信 payload のシリアライズ

`typespec2` は compile-time 側、`specloom2` は runtime 側です。

## Quick Start

```ts
import specJson from "./spec.json";
import {
  createListVM,
  createFormVM,
  serializeForm,
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

## ViewModel Shape

生成される ViewModel の中心は次です。

- `ListViewModel`
  `columns`, `rows`, `namedFilters`, `pageActions`, `selectionActions`
- `ShowViewModel`
  `fields`, `sections`, `actions`
- `FormViewModel`
  `fields`, `sections`, `actions`, `isValid`, `isDirty`

すべての型は package root から export されます。

## Package Boundary

- `specloom2` は `@specloom/spec` を参照します
- `specloom2` は `TypeSpec` / `@typespec/compiler` に依存しません
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
  vm/           # ViewModel 型
```
