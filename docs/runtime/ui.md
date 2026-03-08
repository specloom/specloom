# UI Resolver

`createUiResolver()` は component を返しません。renderer key と merged metadata を返します。

## API

```ts
import { createUiResolver } from "specloom";
```

```ts
const ui = createUiResolver({
  defaults: {
    fieldRenderers: {
      scalar: "text-input",
      enum: "select",
      relation: "relation-picker",
      nested: "nested-table",
    },
    actionRenderers: {
      page: "toolbar-button",
      row: "row-button",
    },
    sectionRenderer: "record-section",
    columnRenderer: "text-column",
  },
  resources: {
    User: {
      client: {
        analyticsKey: "user",
      },
      fields: {
        email: {
          renderer: "email-input",
          props: {
            autocomplete: "email",
          },
        },
      },
      views: {
        form: {
          fields: {
            email: {
              appearance: "link",
            },
          },
        },
      },
    },
  },
});
```

## Resolver Surface

- `ui.field(...)`
- `ui.action(...)`
- `ui.section(...)`
- `ui.column(...)`

## Field Resolution

```ts
const presentation = ui.field({
  resource,
  field,
  view: "form",
});
```

返るものの中心:

```ts
type ResolvedFieldPresentation = {
  renderer: string;
  label: string;
  appearance?: string;
  state: {
    visible: boolean;
    required: boolean;
    readonly: boolean;
    disabled: boolean;
    invalid: boolean;
  };
  hints: {
    placeholder?: string;
    help?: string;
    emptyText?: string;
    format?: string;
  };
  layout: {
    section?: string;
    order?: number;
    placement?: string;
    span?: number;
  };
  props: Record<string, unknown>;
  client: Record<string, unknown>;
  source: {
    renderer:
      | "resource-config"
      | "view-config"
      | "field-ui.widget"
      | "global-default"
      | "semantic-default";
  };
};
```

## Resolution Priority

field renderer は次の順で決まります。

1. view-level resource config
2. resource-level config
3. `field.ui.widget`
4. global field defaults
5. semantic default

semantic default 例:

- scalar -> `text-input`
- enum -> `select`
- relation(one) -> `relation-picker`
- relation(many) -> `relation-multi-picker`
- nested(table) -> `nested-table`

## Action / Section / Column

同じ考え方で:

- action -> renderer, confirmMessage, props, client
- section -> renderer, layout, props, client
- column -> renderer, placement, props, client

を返します。

## Framework Integration

React / Solid / Svelte 側では renderer key を registry に結びます。

```ts
const presentation = ui.field({ resource, field, view: "form" });
const Renderer = registry.fields[presentation.renderer];
```

`specloom` 自体は framework component を知りません。
