# Entity

resource 全体と一覧/詳細/フォームの骨格を定義します。

## Main Decorators

- `@entity`
- `@index`
- `@section`
- `@namedFilter`
- `@rule`

## `@entity`

```typespec
@entity(#{
  label: "User",
  pluralLabel: "Users",
  titleField: "name",
  pageSize: 50,
  defaultSort: #{ field: "name", direction: "asc" },
  views: {
    list: #{ enabled: true },
    form: #{ enabled: true },
    show: #{ enabled: true }
  },
  client: #{
    analyticsKey: "user"
  }
})
model User {}
```

主な役割:

- resource label
- default sort
- page size
- view enable/disable
- resource-level client metadata

## `@index`

list view の設定です。

```typespec
@index(#{
  columns: #[
    "id",
    #{
      field: "name",
      label: "Account",
      sortable: true,
      placement: "primary"
    }
  ],
  searchable: #["name", "email"],
  sortable: #["name", "email"],
  defaultSort: #{ field: "name", direction: "asc" },
  selection: "multi",
  clickAction: "show"
})
model User {}
```

## `@section`

form/show の grouping を定義します。

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

## `@namedFilter`

list 用の preset filter です。

```typespec
@namedFilter("active", #{
  label: "Active",
  where: {
    field: "status",
    operator: "eq",
    value: "active"
  }
})
model User {}
```

## `@rule`

cross-field validation を定義します。

```typespec
@rule(#{ kind: "requireOneOf", fields: #["email", "phone"] })
@rule(#{ kind: "requiredIf", field: "reason", when: "status == 'inactive'" })
@rule(#{ kind: "comparison", left: "endDate", operator: ">=", right: "startDate" })
model User {}
```

サポートされる `kind`:

- `requireOneOf`
- `comparison`
- `requiredIf`
- `mutuallyExclusive`
- `requiredTogether`
