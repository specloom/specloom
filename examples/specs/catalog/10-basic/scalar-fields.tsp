import "../shared/imports.tsp";

using Specloom;

@entity(#{
  label: "Basic Scalar",
  pluralLabel: "Basic Scalars",
  titleField: "title",
  pageSize: 25,
  defaultSort: #{ field: "title", direction: "asc" }
})
@listView(#{
  columns: #["id", "title", "count", "enabled", "createdAt"],
  search: #{ fields: #["title"] },
  sortable: #["title", "count", "createdAt"],
  selection: "single",
  clickAction: "show"
})
@section("basic", #{ label: "Basic", view: "form", order: 10 })
model BasicScalarExample {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true, order: 10 })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true, section: "basic", order: 20 })
  @minLength(1)
  title: string;

  @field(#{ label: "Count", list: true, show: true, form: true, section: "basic", order: 30, widget: "number-input" })
  @minValue(0)
  count: int32;

  @field(#{ label: "Enabled", list: true, show: true, form: true, section: "basic", order: 40, widget: "switch" })
  enabled: boolean;

  @field(#{ label: "Created At", list: true, show: true, form: false, readonly: true, order: 50, format: "relative" })
  createdAt: utcDateTime;
}
