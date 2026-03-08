import "../shared/imports.tsp";
import "../shared/common-resources.tsp";

using Specloom;

@entity(#{ label: "Option Source", pluralLabel: "Option Sources", titleField: "title" })
@index(#{ columns: #["title", "departmentId", "reviewerId"], searchable: #["title"], sortable: #["title"] })
model OptionSourceExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true })
  title: string;

  @field(#{ label: "Department", list: true, show: true, form: true, widget: "autocomplete" })
  @optionSource(#{
    resource: "Department",
    labelField: "name",
    valueField: "id",
    searchFields: #["name"]
  })
  departmentId?: string;

  @field(#{ label: "Reviewer", list: false, show: true, form: true, widget: "autocomplete" })
  @optionSource(#{
    resource: "Member",
    labelField: "name",
    valueField: "id",
    searchFields: #["name", "email"]
  })
  reviewerId?: string;
}
