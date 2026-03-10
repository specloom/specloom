# specloom

Headless admin runtime and TypeSpec DSL for compiled spec v1.

```text
TypeSpec -> compiled spec JSON -> specloom -> state / validation / VM / UI metadata -> UI
```

UI 側は権限や表示条件を再実装せず、`specloom` が返す state / ViewModel / UI metadata を描画します。

## Packages

| Package | Role |
| --- | --- |
| `specloom` | Runtime core: loader, evaluator, validation, state, serialize, options, filter, format, action, UI resolver |
| `@specloom/typespec` | TypeSpec decorators and emitter for compiled spec v1 |
| `@specloom/spec` | Shared compiled spec contract |
| `@specloom/auth-provider` | Auth abstraction |
| `@specloom/data-provider` | Data access abstraction |
| `@specloom/api` | API TypeSpec package |

## Install

```bash
pnpm add specloom @specloom/spec
pnpm add -D @specloom/typespec @typespec/compiler
```

## Quick Start

### 1. Define a resource in TypeSpec

```typespec
import "@specloom/typespec";

using Specloom;

@entity(#{
  label: "User",
  pluralLabel: "Users",
  titleField: "name"
})
@listView(#{
  columns: #["name", "email"],
  search: #{ fields: #["name", "email"] },
  sortable: #["name"],
  selection: "multi",
  clickAction: "show"
})
model User {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true })
  @minLength(1)
  name: string;

  @field(#{ label: "Email", list: true, show: true, form: true })
  email: string;
}
```

### 2. Compile it

```yaml
# tspconfig.yaml
emit:
  - "@specloom/typespec"
options:
  "@specloom/typespec":
    output-file: "admin/spec.json"
```

```bash
tsp compile .
```

### 3. Use the runtime

```ts
import specJson from "./admin/spec.json";
import {
  createFormState,
  createListState,
  createOptionsResolver,
  createUiResolver,
  validateSpec,
} from "specloom";

const spec = validateSpec(specJson);

let form = createFormState({
  spec,
  resource: "User",
  mode: "create",
  context: { role: "admin" },
});

form = form.setValue("name", "Alice");

const list = createListState({
  spec,
  resource: "User",
  context: { role: "admin" },
  data: [{ id: "1", name: "Alice", email: "alice@example.com" }],
});

const options = createOptionsResolver({ spec });
const ui = createUiResolver();

const formVM = form.view();
const listVM = list.view();
const validation = form.validate();
const payload = form.serialize();
```

## Runtime Surface

- Loader: `parseSpec`, `validateSpec`
- VM builders: `createListVM`, `createShowVM`, `createFormVM`, `createInputVM`
- State: `createFormState`, `createInputState`, `createListState`
- Validation: `resolveFieldState`, `validateField`, `validateForm`
- Normalize: `normalizeInputValue`, `updateFieldValue`, nested item helpers
- Serialize: `serializeForm`, `serializeResource`, `serializeInput`
- Options: `createOptionsResolver`
- Filter: `evaluateFilter`, `filterRecords`, `applyNamedFilter`
- Format: `formatValue`, `formatColumnValue`, `formatTemplate`
- Actions: `buildActionRequest`, `interpolateActionPath`
- UI metadata: `createUiResolver`

## Notes

- `specloom` 自体は React / Solid / Svelte の component を持ちません。
- UI framework 側では registry / adapter を薄く被せる想定です。
- backend 側でも validation, filter, action request descriptor を共通利用できます。

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## Examples

examples は workspace に入れず、独立したサンプルとして管理しています。

SolidJS example はルートから次で実行できます。

```bash
pnpm example:solidjs:install
pnpm example:solidjs:dev
```

直接 example 配下で実行しても構いません。
