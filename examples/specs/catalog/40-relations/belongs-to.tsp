import "../shared/imports.tsp";
import "../shared/common-resources.tsp";

using Specloom;

@entity(#{ label: "Belongs To Relation", pluralLabel: "Belongs To Relations", titleField: "name" })
@listView(#{ columns: #["name", "departmentId"], search: #{ fields: #["name"], sortable: #["name"] } })
model BelongsToRelationExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true, order: 10 })
  name: string;

  @field(#{ label: "Department", list: true, show: true, form: true, order: 20, widget: "autocomplete" })
  @relation(Department, #{
    kind: "belongsTo",
    cardinality: "one",
    labelField: "name",
    valueField: "id",
    submitField: "departmentId",
    searchFields: #["name"],
    lookupResource: "Department",
    lookupOp: "listDepartments",
    linkTo: "show",
    creatable: false,
    client: #{
      modalSize: "lg"
    }
  })
  departmentId?: string;
}
