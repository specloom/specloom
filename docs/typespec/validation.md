# Validation

validation は TypeSpec built-in と specloom 独自 rule の組み合わせで表現します。

## Field-Level Validation

TypeSpec built-in を使います。

```typespec
@field(#{ label: "Age", form: true })
@minValue(18)
@maxValue(65)
age?: int32;

@field(#{ label: "Name", form: true })
@minLength(1)
@maxLength(100)
name: string;

@field(#{ label: "Email", form: true })
@pattern("email")
email?: string;
```

compiled field validation:

- `minValue`
- `maxValue`
- `minLength`
- `maxLength`
- `pattern`
- `minItems`
- `maxItems`
- `match`

## Conditional Validation

field-level の条件付き rule は specloom decorator です。

```typespec
@field(#{ label: "Publish URL", form: true })
@requiredWhen("status == 'published'")
publishUrl?: string;

@field(#{ label: "Reason", form: true })
@visibleWhen("status == 'inactive'")
@requiredWhen("status == 'inactive'")
reason?: string;

@field(#{ label: "Internal Memo", form: true })
@readonlyWhen("role != 'admin'")
memo?: string;

@field(#{ label: "Archived Note", form: true })
@disabledWhen("status == 'archived'")
archivedNote?: string;
```

## Match Validation

```typespec
@field(#{ label: "Password", form: true })
password?: string;

@field(#{ label: "Password Confirm", form: true })
@match("password")
passwordConfirm?: string;
```

## Model-Level Rules

cross-field validation は `@rule` を使います。

```typespec
@rule(#{ kind: "requireOneOf", fields: #["email", "phone"] })
@rule(#{ kind: "requiredIf", field: "reason", when: "status == 'inactive'" })
@rule(#{ kind: "mutuallyExclusive", fields: #["email", "phone"] })
@rule(#{ kind: "requiredTogether", fields: #["startDate", "endDate"] })
@rule(#{ kind: "comparison", left: "endDate", operator: ">=", right: "startDate" })
model User {}
```

利用できる `kind`:

- `requireOneOf`
- `comparison`
- `requiredIf`
- `mutuallyExclusive`
- `requiredTogether`

## Runtime

```ts
import {
  resolveFieldState,
  validateField,
  validateForm,
} from "specloom";
```

用途:

- `resolveFieldState`
  `visible`, `required`, `readonly`, `disabled` を評価
- `validateField`
  単一 field の error 配列
- `validateForm`
  `errors`, `formErrors`, `fieldStates` をまとめて返す

## Notes

- `createOnly` field は edit mode では readonly 扱い
- hidden / disabled / readonly field は runtime validation から外れる
- backend 側でも `validateForm` をそのまま使える
