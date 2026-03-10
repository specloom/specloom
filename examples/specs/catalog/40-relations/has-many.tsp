import "../shared/imports.tsp";
import "../shared/common-resources.tsp";

using Specloom;

@entity(#{ label: "Has Many Relation", pluralLabel: "Has Many Relations", titleField: "name" })
@listView(#{ columns: #["name", "memberIds"], search: #{ fields: #["name"], sortable: #["name"] } })
model HasManyRelationExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true, order: 10 })
  name: string;

  @field(#{ label: "Members", list: true, show: true, form: true, order: 20, widget: "multi-combobox" })
  @relation(Member, #{
    kind: "hasMany",
    cardinality: "many",
    labelField: "name",
    valueField: "id",
    submitField: "memberIds",
    searchFields: #["name", "email"],
    lookupResource: "Member",
    linkTo: "show"
  })
  memberIds: string[];
}
