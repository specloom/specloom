import "../shared/imports.tsp";

using Specloom;

@entity(#{
  label: "Task",
  pluralLabel: "Tasks",
  titleField: "title",
  defaultSort: #{ field: "id", direction: "desc" }
})
@index(#{
  columns: #["id", "title", "done", "createdAt"],
  searchable: #["title"],
  sortable: #["title", "createdAt"],
  clickAction: "show"
})
@section("main", #{ label: "Task", view: "form", order: 10 })
model Task {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true, section: "main", order: 10 })
  @minLength(1)
  title: string;

  @field(#{ label: "Done", list: true, show: true, form: true, section: "main", order: 20, widget: "switch" })
  done: boolean;

  @field(#{ label: "Created At", list: true, show: true, form: false, readonly: true, order: 30, format: "relative" })
  createdAt: utcDateTime;
}
