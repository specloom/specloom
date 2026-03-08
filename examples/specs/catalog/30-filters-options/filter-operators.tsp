import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Filter Operators", pluralLabel: "Filter Operators", titleField: "title" })
@index(#{ columns: #["title", "status", "createdAt"], searchable: #["title"], sortable: #["title", "createdAt"] })
model FilterOperatorsExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true })
  @filter(#["eq", "contains", "startsWith"])
  title: string;

  @field(#{ label: "Status", list: true, show: true, form: true, widget: "select" })
  @options(#[
    #{ value: "draft", label: "Draft" },
    #{ value: "review", label: "Review" },
    #{ value: "published", label: "Published" }
  ])
  @filter(#{
    operators: #["eq", "in"],
    widget: "select",
    placement: "toolbar"
  })
  status: string;

  @field(#{ label: "Created At", list: true, show: true, form: false })
  @filter(#{
    operators: #["gte", "lte"],
    widget: "date-range",
    placement: "advanced"
  })
  createdAt: utcDateTime;
}
