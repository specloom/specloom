import "./imports.tsp";

using Specloom;

@entity(#{ label: "Department", pluralLabel: "Departments", titleField: "name" })
@listView(#{ columns: #["id", "name"], search: #{ fields: #["name"], sortable: #["name"] }, clickAction: "show" })
model Department {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true, order: 10 })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true, order: 20 })
  @minLength(1)
  name: string;
}

@entity(#{ label: "Tag", pluralLabel: "Tags", titleField: "name" })
@listView(#{ columns: #["id", "name", "color"], search: #{ fields: #["name"], sortable: #["name"] } })
model Tag {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true })
  name: string;

  @field(#{ label: "Color", list: true, show: true, form: true, widget: "color-input" })
  color: string;
}

@entity(#{ label: "Member", pluralLabel: "Members", titleField: "name" })
@listView(#{ columns: #["id", "name", "email"], search: #{ fields: #["name", "email"], sortable: #["name", "email"] } })
model Member {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true })
  @minLength(1)
  name: string;

  @field(#{ label: "Email", list: true, show: true, form: true, appearance: "link" })
  email: string;
}
