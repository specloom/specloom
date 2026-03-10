# Filter

TypeSpec 側で filter surface を定義する方法です。

## `@listView.filters`

field ごとの組み合わせ filter は `@listView.filters` に置きます。

```typespec
@listView(#{
  columns: #["title", "status", "createdAt"],
  search: #{ fields: #["title"] },
  filters: #[
    #{ field: "title", operators: #["contains", "startsWith"] },
    #{ field: "status", operators: #["eq", "in"], widget: "select" },
    #{ field: "createdAt", operators: #["gte", "lte"], widget: "date-range", placement: "advanced" }
  ]
})
model Post {}
```

## Named Filters

`@listView` の `namedFilters` で preset filter を定義します。

```typespec
@listView(#{
  columns: #["title", "status", "createdAt"],
  namedFilters: #[
    #{ id: "mine", label: "Mine", conditions: #{
      field: "authorId", operator: "eq", value: #{ context: "user.id" }
    }},
    #{ id: "recent", label: "Recent", conditions: #{
      field: "createdAt", operator: "gte", value: #{ relative: "-7d" }
    }}
  ]
})
model Post {}
```

## Filter Expression

```typespec
@listView(#{
  columns: #["title", "status"],
  namedFilters: #[
    #{ id: "publishedNews", label: "Published News", conditions: #{
      and: #[
        #{ field: "status", operator: "eq", value: "published" },
        #{ field: "category", operator: "eq", value: "news" }
      ]
    }}
  ]
})
model Post {}
```

使える shape:

- single condition
- `and`
- `or`
- `not`

## Runtime

compiled filter は runtime の次に接続されます。

```ts
import {
  evaluateFilter,
  filterRecords,
  applyNamedFilter,
  resolveFilterValue,
} from "specloom";
```

これで frontend / backend の両方から同じ filter shape を扱えます。
