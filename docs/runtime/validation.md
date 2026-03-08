# Validation

validation は frontend / backend の両方でそのまま使える headless API です。

## APIs

- `resolveFieldState`
- `validateField`
- `validateForm`

## Field State

`resolveFieldState()` は表示と validation の共通判定を返します。

```ts
import { resolveFieldState } from "specloom";

const state = resolveFieldState({
  field,
  context: { role: "admin" },
  values: { status: "published" },
  mode: "edit",
  view: "form",
});
```

返るもの:

```ts
type FieldRuntimeState = {
  visible: boolean;
  required: boolean;
  readonly: boolean;
  disabled: boolean;
};
```

評価対象:

- `field.ui.visibleIn`
- `field.ui.readonly`
- `field.computed`
- `field.createOnly`
- `requiredWhen`
- `visibleWhen`
- `readonlyWhen`
- `disabledWhen`

## Single Field Validation

```ts
import { validateField } from "specloom";

const errors = validateField({
  resource,
  fieldName: "email",
  values: { email: "bad" },
  context: { role: "admin" },
  mode: "create",
});
```

返り値は `string[]` です。

## Form / Input Validation

```ts
import { validateForm } from "specloom";

const result = validateForm({
  resource,
  values,
  context: { role: "admin" },
  mode: "edit",
});
```

```ts
type ValidationResult = {
  valid: boolean;
  errors: Record<string, string[]>;
  formErrors: string[];
  fieldStates: Record<string, FieldRuntimeState>;
};
```

## What Gets Validated

field-level:

- `minValue`
- `maxValue`
- `minLength`
- `maxLength`
- `pattern`
- `minItems`
- `maxItems`
- `match`
- required state

model-level:

- `requireOneOf`
- `comparison`
- `requiredIf`
- `mutuallyExclusive`
- `requiredTogether`

## Validation Semantics

- hidden field は validation 対象外
- disabled field は validation 対象外
- readonly field は validation 対象外
- `createOnly` field は edit mode で readonly 扱い
- `requiredWhen` は current values と context に対して評価されます

## Pattern Note

`pattern` は semantic alias ではなく regex 文字列です。

```ts
@pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
```

## Backend Use

server 側でも同じ shape をそのまま使えます。

```ts
const result = validateForm({
  resource,
  values: requestBody,
  context: authContext,
  mode: "create",
});

if (!result.valid) {
  return { status: 422, body: result };
}
```
