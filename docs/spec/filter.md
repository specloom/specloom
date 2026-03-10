# Filter Spec

一覧検索と preset filter の現行仕様です。

## TypeSpec Surface

### `@listView.filters`

field ごとの filter は list view 側で定義します。

```typespec
import "@specloom/typespec";

using Specloom;

@entity(#{ label: "Post" })
@listView(#{
  columns: #["title", "status"],
  search: #{ fields: #["title"] },
  filters: #[
    #{ field: "title", operators: #["contains", "startsWith"] },
    #{ field: "status", operators: #["eq", "neq", "in"] }
  ],
  namedFilters: #[
    #{ id: "published", label: "Published", conditions: #{
      field: "status", operator: "eq", value: "published"
    }}
  ]
})
model Post {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true })
  title: string;

  @field(#{ label: "Status", list: true, show: true, form: true })
  status: string;
}
```

### Named Filters (`@listView` の `namedFilters`)

`@listView` の `namedFilters` で preset filter を定義します。

```typespec
@listView(#{
  columns: #["title", "status"],
  namedFilters: #[
    #{ id: "mine", label: "My Posts", conditions: #{
      field: "authorId", operator: "eq", value: #{ context: "user.id" }
    }},
    #{ id: "recent", label: "Recent", conditions: #{
      field: "createdAt", operator: "gte", value: #{ relative: "-7d" }
    }}
  ]
})
model Post { /* ... */ }
```

## Compiled Shape

```ts
type FilterExpression =
  | {}
  | { field: string; operator: string; value: FilterValue }
  | { and: FilterExpression[] }
  | { or: FilterExpression[] }
  | { not: FilterExpression };

type FilterValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | boolean[]
  | { context: string }
  | { relative: string };
```

## Runtime Helpers

```ts
import {
  evaluateFilter,
  filterRecords,
  applyNamedFilter,
  resolveFilterValue,
} from "specloom";
```

用途:

- `evaluateFilter`
  単一 record に filter を適用
- `filterRecords`
  record 配列に filter を適用
- `applyNamedFilter`
  compiled named filter をそのまま適用
- `resolveFilterValue`
  `{ context: "user.id" }` や `{ relative: "-7d" }` を実値へ変換

## Operators

現在 runtime helper が直接評価する主な operator:

- `eq`, `==`
- `neq`, `!=`
- `contains`
- `notContains`
- `startsWith`
- `endsWith`
- `in`
- `notIn`
- `gt`, `gte`, `lt`, `lte`
- `exists`, `notExists`

## Notes

- UI 表現は自由です。tab, select, chip などを強制しません。
- backend 側で DB query に変換する場合でも、compiled filter shape はそのまま再利用できます。
