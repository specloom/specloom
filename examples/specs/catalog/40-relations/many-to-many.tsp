import "../shared/imports.tsp";
import "../shared/common-resources.tsp";

using Specloom;

@entity(#{ label: "Many To Many Relation", pluralLabel: "Many To Many Relations", titleField: "title" })
@listView(#{ columns: #["title", "tagIds"], search: #{ fields: #["title"], sortable: #["title"] } })
model ManyToManyRelationExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true, order: 10 })
  title: string;

  @field(#{ label: "Tags", list: true, show: true, form: true, order: 20, widget: "multi-combobox" })
  @relation(Tag, #{
    kind: "manyToMany",
    cardinality: "many",
    labelField: "name",
    valueField: "id",
    submitField: "tagIds",
    searchFields: #["name"],
    lookupResource: "Tag",
    linkTo: "none",
    creatable: true,
    client: #{
      creationMode: "modal"
    }
  })
  tagIds: string[];
}
