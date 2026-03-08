# Filter

TypeSpec 側で filter surface を定義する方法です。

## `@filter`

field を filter UI に公開します。

```typespec
@field(#{ label: "Title", list: true, form: true, show: true })
@filter(#["contains", "startsWith"])
title: string;

@field(#{ label: "Created At", list: true, show: true })
@filter(#{
  operators: #["gte", "lte"],
  widget: "date-range",
  placement: "advanced"
})
createdAt: utcDateTime;
```

## `@namedFilter`

resource model に preset filter を定義します。

```typespec
@namedFilter("mine", #{
  label: "Mine",
  where: {
    field: "authorId",
    operator: "eq",
    value: { context: "user.id" }
  }
})
@namedFilter("recent", #{
  label: "Recent",
  where: {
    field: "createdAt",
    operator: "gte",
    value: { relative: "-7d" }
  }
})
model Post {}
```

## Filter Expression

```typespec
@namedFilter("publishedNews", #{
  label: "Published News",
  where: {
    and: [
      { field: "status", operator: "eq", value: "published" },
      { field: "category", operator: "eq", value: "news" }
    ]
  }
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
