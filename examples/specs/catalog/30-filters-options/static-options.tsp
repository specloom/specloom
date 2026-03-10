import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Static Options", pluralLabel: "Static Options", titleField: "title" })
@listView(#{ columns: #["title", "priority", "published"], search: #{ fields: #["title"], sortable: #["title", "priority"] } })
model StaticOptionsExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true })
  title: string;

  @field(#{ label: "Priority", list: true, show: true, form: true, widget: "select" })
  @options(#[
    #{ value: 1, label: "Low" },
    #{ value: 2, label: "Medium" },
    #{ value: 3, label: "High" }
  ])
  priority: int32;

  @field(#{ label: "Published", list: true, show: true, form: true, widget: "switch" })
  @options(#[
    #{ value: true, label: "Published" },
    #{ value: false, label: "Draft" }
  ])
  published: boolean;
}
