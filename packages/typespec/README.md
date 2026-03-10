# @specloom/typespec

TypeSpec デコレータと emitter。TypeSpec モデル定義から specloom の compiled spec v1 JSON を生成します。

## Install

```bash
pnpm add -D @specloom/typespec @typespec/compiler
```

## Quick Start

```typespec
import "@specloom/typespec";

using Specloom;

@entity(#{
  label: "User",
  pluralLabel: "Users",
  titleField: "name",
  defaultSort: #{ field: "name", direction: "asc" }
})
@listView(#{
  columns: #["id", "name", "email"],
  search: #{ fields: #["name", "email"] },
  filters: #[
    #{ field: "name", operators: #["eq", "contains"] }
  ],
  sortable: #["name", "email"],
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
}
```

```yaml
emit:
  - "@specloom/typespec"
options:
  "@specloom/typespec":
    output-file: "spec.json"
```

## Commands

```bash
pnpm build
pnpm dev
pnpm typecheck
pnpm test
```
