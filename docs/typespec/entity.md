# Entity

resource 全体と一覧/詳細/フォームの骨格を定義します。

## Main Decorators

- `@entity`
- `@listView`
- `@showView`
- `@formView`
- `@section`
- `@rule`

## `@entity`

```typespec
@entity(#{
  label: "User",
  pluralLabel: "Users",
  titleField: "name",
  pageSize: 50,
  defaultSort: #{ field: "name", direction: "asc" },
  operations: #{
    list: true,
    show: true,
    create: true,
    edit: true,
    delete: true
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
- operation enable/disable
- resource-level client metadata

## `@listView`

list view の設定です。

```typespec
@listView(#{
  columns: #[
    "id",
    #{
      field: "name",
      label: "Account",
      sortable: true,
      placement: "primary"
    }
  ],
  search: #{ fields: #["name", "email"] },
  sortable: #["name", "email"],
  defaultSort: #{ field: "name", direction: "asc" },
  selection: "multi",
  clickAction: "show",
  namedFilters: #[
    #{ id: "active", label: "Active", conditions: #{
      field: "status", operator: "eq", value: "active"
    }}
  ]
})
model User {}
```

## `@showView` / `@formView`

record page の action 配置です。

```typespec
@showView(#{ pageActions: #["sync"] })
@formView(#{ pageActions: #["duplicate"] })
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
