import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Filter Operators", pluralLabel: "Filter Operators", titleField: "title" })
@listView(#{
  columns: #["title", "status", "createdAt"],
  search: #{ fields: #["title"] },
  filters: #[
    #{ field: "title", operators: #["eq", "contains", "startsWith"] },
    #{ field: "status", operators: #["eq", "in"], widget: "select", placement: "toolbar" },
    #{ field: "createdAt", operators: #["gte", "lte"], widget: "date-range", placement: "advanced" }
  ],
  sortable: #["title", "createdAt"]
})
model FilterOperatorsExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true })
  title: string;

  @field(#{ label: "Status", list: true, show: true, form: true, widget: "select" })
  @options(#[
    #{ value: "draft", label: "Draft" },
    #{ value: "review", label: "Review" },
    #{ value: "published", label: "Published" }
  ])
  status: string;

  @field(#{ label: "Created At", list: true, show: true, form: false })
  createdAt: utcDateTime;
}
