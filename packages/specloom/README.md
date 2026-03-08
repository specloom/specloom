# specloom

Headless admin runtime for compiled spec v1.

`specloom` は compiled spec JSON を読み込み、state / validation / ViewModel / UI metadata を生成します。

```text
spec JSON -> specloom -> state / validation / VM / UI metadata -> UI
```

## Main APIs

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

## Quick Start

```ts
import specJson from "./spec.json";
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

## Development

```bash
pnpm --filter specloom build
pnpm --filter specloom test
pnpm --filter specloom typecheck
```
