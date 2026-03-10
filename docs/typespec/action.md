# Action

action は operation に付けます。view への配置は `@listView` / `@showView` / `@formView` 側に書き、HTTP method / path / input / output は operation から取ります。

## `@action`

```typespec
model ExportUsersInput {
  @field(#{ label: "Format", form: true })
  format: string;
}

@listView(#{
  pageActions: #[
    #{ ref: "export", selection: "query" }
  ],
  rowActions: #["suspend"]
})
model User {}

@action(User, #{
  id: "export",
  label: "Export",
  prominence: "secondary",
  icon: "download",
  when: "role == 'admin'"
}, ExportUsersInput)
op exportUsers(): string;

@action(User, #{
  id: "suspend",
  label: "Suspend",
  confirm: #{
    message: "Are you sure?"
  },
  when: "status == 'active'",
  disabledWhen: "locked == true",
  prominence: "danger"
})
op suspendUser(): string;
```

## Common Options

- `id`
- `label`
- `placement`
- `order`
- `icon`
- `prominence`
- `confirm`
- `args`
- `when`
- `disabledWhen`
- `client`

## Placement

list page action だけ:

- `selection`

view 側では action ref として次を上書きできます。

- `ref`
- `selection`
- `label`
- `placement`
- `order`
- `icon`
- `prominence`
- `confirm`
- `args`
- `when`
- `disabledWhen`
- `client`

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
