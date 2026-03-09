---
name: specloom-spec
description: Use this skill when creating or modifying admin UI specifications with @specloom/typespec. Covers the current v1 DSL, decorator surface, runtime connections, and safe authoring patterns. @specloom/typespec で管理画面 UI spec を新規作成・更新するときに使う。
---

# specloom Spec Writing Skill

この skill は現行の `@specloom/typespec` DSL で admin UI spec を書くときに使います。

前提:

- package は `@specloom/typespec`
- namespace は `using Specloom;`
- compiled spec は v1
- runtime は `specloom`

使わないもの:

- `@S.` プレフィックス
- `@resource`, `@label`, `@kind`, `@view`, `@action`
- `createAdmin`
- class-based `FormVM`

## When to Activate

- resource を新規作成するとき
- field / relation / nested を追加するとき
- list / filter / section / action を定義するとき
- TypeSpec spec を runtime にどうつなぐか迷うとき
- `@rule` や条件付き validation を書くとき

## Project Setup

### Install

```bash
pnpm add specloom @specloom/spec
pnpm add -D @specloom/typespec @typespec/compiler
```

### Minimal Structure

```text
my-project/
  specs/
    main.tsp
  tspconfig.yaml
  src/
    spec.json
```

### `main.tsp`

```typespec
import "@specloom/typespec";

using Specloom;
```

複数ファイルに分けるなら:

```typespec
import "@specloom/typespec";

using Specloom;

import "./resources/user.tsp";
import "./resources/post.tsp";
import "./actions/post-actions.tsp";
```

### `tspconfig.yaml`

1ファイルにまとめる場合:

```yaml
emit:
  - "@specloom/typespec"
options:
  "@specloom/typespec":
    output-file: "src/spec.json"
```

`output-file` を省略すると、resource ごとの JSON が emitter output dir に出ます。

## Namespace Convention

現行 DSL はこれです。

```typespec
import "@specloom/typespec";

using Specloom;
```

必ず unqualified decorator を使います。

```typespec
@entity(...)
@field(...)
@index(...)
```

`@S.resource` のような旧記法は使いません。

## TypeSpec Value Literals

decorator option や filter / namedFilter の object / array literal は TypeSpec の value literal を使います。

```typespec
@entity(#{
  label: "User",
  views: #{
    list: #{ enabled: true }
  }
})

@namedFilter("mine", #{
  label: "Mine",
  conditions: #{
    field: "authorId",
    operator: "eq",
    value: #{ context: "user.id" }
  }
})
```

要点:

- object は `#{ ... }`
- array は `#[ ... ]`
- plain `{ ... }` / `[ ... ]` を decorator value に使わない

## Quick Reference

### 1. Resource

```typespec
@entity(#{
  label: "User",
  pluralLabel: "Users",
  titleField: "name",
  pageSize: 50,
  defaultSort: #{ field: "name", direction: "asc" }
})
model User {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true })
  @minLength(1)
  name: string;
}
```

### 2. List View

```typespec
@index(#{
  columns: #[
    "name",
    "email",
    #{
      field: "status",
      label: "Status",
      sortable: true
    }
  ],
  searchable: #["name", "email"],
  sortable: #["name", "email", "status"],
  selection: "multi",
  clickAction: "show"
})
@namedFilter("active", #{
  label: "Active",
  conditions: #{
    field: "status",
    operator: "eq",
    value: "active"
  }
})
model User {}
```

### 3. Field Metadata

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
  placeholder: "alice@example.com",
  help: "Primary contact address",
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

### 4. Relation

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

### 5. Nested

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

### 6. Static / Remote Options

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

### 7. Field Rules

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
```

### 8. Sections

```typespec
@section("basic", #{
  label: "Basic",
  order: 10,
  view: "form"
})
@section("meta", #{
  label: "Metadata",
  order: 20,
  view: "show",
  collapsible: true,
  defaultCollapsed: true
})
model User {}
```

### 9. Actions

action は model ではなく operation に付けます。

```typespec
model ExportUsersInput {
  @field(#{ label: "Format", form: true })
  format: string;
}

@pageAction(User, #{
  id: "export",
  view: "list",
  label: "Export",
  selection: "query",
  prominence: "secondary",
  icon: "download",
  when: "role == 'admin'"
}, ExportUsersInput)
op exportUsers(): string;

@rowAction(User, #{
  id: "suspend",
  label: "Suspend",
  confirmMessage: "Are you sure?",
  when: "status == 'active'",
  disabledWhen: "locked == true",
  prominence: "danger"
})
op suspendUser(): string;
```

### 10. Cross-Field Rules

```typespec
@rule(#{ kind: "requireOneOf", fields: #["email", "phone"] })
@rule(#{ kind: "requiredIf", field: "reason", when: "status == 'inactive'" })
@rule(#{ kind: "comparison", left: "endDate", operator: ">=", right: "startDate" })
model User {}
```

使える `kind`:

- `requireOneOf`
- `comparison`
- `requiredIf`
- `mutuallyExclusive`
- `requiredTogether`

## Decorator Reference

### Resource / View

| Decorator | Target | Purpose |
|-----------|--------|---------|
| `@entity(#{ ... })` | Model | resource metadata |
| `@index(#{ ... })` | Model | list config |
| `@section(id, #{ ... })` | Model | form/show section |
| `@namedFilter(id, #{ ... })` | Model | preset list filter |
| `@rule(#{ ... })` | Model | cross-field validation |

### Field

| Decorator | Target | Purpose |
|-----------|--------|---------|
| `@field(#{ ... })` | Property | field UI metadata |
| `@relation(Model, #{ ... })` | Property | relation config |
| `@nested(Model, #{ ... })` | Property | nested child config |
| `@options(#[])` | Property | static options |
| `@optionSource(#{ ... })` | Property | remote options |
| `@filter(...)` | Property | filter exposure |
| `@hidden` | Property | always hidden |
| `@computed` | Property | computed field |
| `@createOnly` | Property | create-only editable |
| `@visibleWhen(expr)` | Property | conditional visibility |
| `@requiredWhen(expr)` | Property | conditional required |
| `@readonlyWhen(expr)` | Property | conditional readonly |
| `@disabledWhen(expr)` | Property | conditional disabled |
| `@match(field)` | Property | field equality validation |

### Action

| Decorator | Target | Purpose |
|-----------|--------|---------|
| `@pageAction(Resource, #{ ... }, Input?)` | Operation | page action |
| `@rowAction(Resource, #{ ... }, Input?)` | Operation | row action |

### Validation

TypeSpec built-ins を使います。

- `@minValue`
- `@maxValue`
- `@minLength`
- `@maxLength`
- `@pattern`
- `@minItems`
- `@maxItems`

## Expressions

field rules と action rules では文字列 expression を使います。

```typespec
@requiredWhen("status == 'published'")
@readonlyWhen("role != 'admin'")
@disabledWhen("record.ownerId != user.id")
```

使える代表的な値:

- `role`
- `user`
- `record`
- current record fields

## Filters

単純 filter:

```typespec
@field(#{ label: "Title", list: true, show: true, form: true })
@filter(#["contains", "startsWith"])
title: string;
```

詳細 filter:

```typespec
@field(#{ label: "Created At", list: true, show: true })
@filter(#{
  operators: #["gte", "lte"],
  widget: "date-range",
  placement: "advanced"
})
createdAt: utcDateTime;
```

named filter:

```typespec
@namedFilter("mine", #{
  label: "Mine",
  conditions: #{
    field: "authorId",
    operator: "eq",
    value: #{
      context: "user.id"
    }
  }
})
model Post {}
```

## Runtime Connection

TypeSpec で書いた spec は runtime の次に接続されます。

```ts
import {
  buildActionRequest,
  createFormState,
  createInputState,
  createListState,
  createOptionsResolver,
  createUiResolver,
  validateForm,
  validateSpec,
} from "specloom";
```

主な使い道:

- `validateSpec`
  compiled spec JSON の読み込み
- `createFormState`
  入力 state, validate, serialize, view
- `createInputState`
  action input / standalone input form の state
- `createListState`
  search, sort, selection, view
- `validateForm`
  backend でも使える validation
- `createOptionsResolver`
  static / remote options 統一取得
- `createUiResolver`
  renderer key と UI metadata 解決
- `buildActionRequest`
  action metadata を request descriptor に変換

## FormState Example

```ts
import specJson from "./spec.json";
import {
  createFormState,
  createUiResolver,
  validateSpec,
} from "specloom";

const spec = validateSpec(specJson);
let form = createFormState({
  spec,
  resource: "Post",
  mode: "create",
  context: { role: "admin" },
});

form = form
  .setValue("title", "Hello")
  .setValue("status", "draft");

const vm = form.view();
const { state: validated, result } = form.validate();

if (result.valid) {
  const payload = validated.serialize();
}

const ui = createUiResolver();
```

`FormState` の主なメソッド:

- `snapshot()`
- `view()`
- `getValue(name)`
- `setValue(name, value)`
- `patch(values)`
- `validate()`
- `serialize()`
- `reset()`

## Checklist

- `using Specloom;` を使っている
- `@S.` や `@resource` など旧 DSL を使っていない
- resource には `@entity`
- 描画する field には `@field`
- list 設定は `@index`
- named filter は `@namedFilter`
- relation は `@relation`
- nested child は `@nested`
- static options は `@options`
- remote options は `@optionSource`
- field 条件は `@visibleWhen` / `@requiredWhen` / `@readonlyWhen` / `@disabledWhen`
- cross-field rule は `@rule`
- page action は `@pageAction`
- row action は `@rowAction`
- validation は TypeSpec built-ins を優先
- runtime 側は `createFormState` / `createListState` / `validateForm` に接続する

## Compile

```bash
pnpm exec tsp compile .
```

1ファイル出力:

- `src/spec.json`

resource ごと出力:

- `{emitter-output-dir}/{resource}.json`

## References

- [`packages/typespec/README.md`](/Volumes/SSD/projects/specloom/packages/typespec/README.md)
- [`docs/typespec/README.md`](/Volumes/SSD/projects/specloom/docs/typespec/README.md)
- [`docs/typespec/entity.md`](/Volumes/SSD/projects/specloom/docs/typespec/entity.md)
- [`docs/typespec/field.md`](/Volumes/SSD/projects/specloom/docs/typespec/field.md)
- [`docs/typespec/input.md`](/Volumes/SSD/projects/specloom/docs/typespec/input.md)
- [`docs/typespec/relation.md`](/Volumes/SSD/projects/specloom/docs/typespec/relation.md)
- [`docs/typespec/validation.md`](/Volumes/SSD/projects/specloom/docs/typespec/validation.md)
- [`docs/typespec/action.md`](/Volumes/SSD/projects/specloom/docs/typespec/action.md)
- [`docs/typespec/filter.md`](/Volumes/SSD/projects/specloom/docs/typespec/filter.md)
- [`docs/runtime/README.md`](/Volumes/SSD/projects/specloom/docs/runtime/README.md)
- [`docs/runtime/state.md`](/Volumes/SSD/projects/specloom/docs/runtime/state.md)
- [`docs/runtime/validation.md`](/Volumes/SSD/projects/specloom/docs/runtime/validation.md)
- [`docs/runtime/options.md`](/Volumes/SSD/projects/specloom/docs/runtime/options.md)
- [`docs/runtime/ui.md`](/Volumes/SSD/projects/specloom/docs/runtime/ui.md)
