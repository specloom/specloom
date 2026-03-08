# Action

action は operation に付けます。HTTP method / path / input / output は TypeSpec 側の operation から取ります。

## `@pageAction`

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
```

## `@rowAction`

```typespec
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

## Common Options

- `id`
- `view`
- `label`
- `placement`
- `order`
- `icon`
- `prominence`
- `confirmMessage`
- `args`
- `when`
- `disabledWhen`
- `client`

`@pageAction` だけ:

- `selection`
- optional input model

## Runtime

runtime では action metadata は `CompiledAction` と `ActionVM` に落ちます。

```ts
import { buildActionRequest } from "specloom";
```

`buildActionRequest()` で:

- interpolated path
- method
- selection mode
- input payload
- selected ids

を request descriptor に変換できます。
