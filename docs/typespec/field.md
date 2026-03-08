# Field

field-level metadata は `@field` を中心に組み立てます。

## `@field`

```typespec
@field(#{
  label: "Email",
  widget: "email-input",
  appearance: "link",
  section: "basic",
  order: 20,
  list: true,
  show: true,
  form: true,
  readonly: false,
  placeholder: "alice@example.com",
  help: "Primary contact address",
  defaultValue: "",
  format: "email",
  emptyText: "-",
  placement: #{
    list: "primary",
    form: "main"
  },
  client: #{
    analyticsKey: "email"
  }
})
email: string;
```

## Relation / Nested / Options

relation / nested / option source の詳細は [Relation](/Volumes/SSD/projects/specloom/docs/typespec/relation.md) を参照してください。

### `@relation`

```typespec
@field(#{ label: "Department", form: true, show: true, list: true })
@relation(Department, #{
  kind: "belongsTo",
  cardinality: "one",
  labelField: "name",
  valueField: "id",
  submitField: "departmentId",
  searchFields: #["name"],
  linkTo: "show"
})
departmentId?: string;
```

### `@nested`

```typespec
@field(#{ label: "Addresses", form: true, show: true })
@nested(Address, #{
  cardinality: "many",
  minItems: 1,
  maxItems: 3,
  widget: "table"
})
addresses: Address[];
```

### `@options` / `@optionSource`

```typespec
@field(#{ label: "Status", form: true })
@options(#[
  #{ value: "draft", label: "Draft" },
  #{ value: "published", label: "Published" }
])
status: string;
```

```typespec
@field(#{ label: "Assignee", form: true })
@optionSource(#{
  resource: "User",
  labelField: "name",
  valueField: "id",
  searchFields: #["name", "email"]
})
assigneeId?: string;
```

## Visibility and Runtime Rules

- `@hidden`
- `@computed`
- `@createOnly`
- `@visibleWhen`
- `@requiredWhen`
- `@readonlyWhen`
- `@disabledWhen`
- `@match`

```typespec
@field(#{ label: "Publish URL", form: true })
@requiredWhen("status == 'published'")
publishUrl?: string;

@field(#{ label: "Reason", form: true })
@visibleWhen("status == 'inactive'")
@requiredWhen("status == 'inactive'")
reason?: string;
```

## Validation

validation の詳細は [Validation](/Volumes/SSD/projects/specloom/docs/typespec/validation.md) を参照してください。

TypeSpec built-in validation を使います。

```typespec
@field(#{ label: "Age", form: true })
@minValue(18)
@maxValue(65)
age?: int32;

@field(#{ label: "Name", form: true })
@minLength(1)
@maxLength(100)
name: string;
```

runtime では次へ落ちます。

- `minValue`
- `maxValue`
- `minLength`
- `maxLength`
- `pattern`
- `minItems`
- `maxItems`
- `match`
