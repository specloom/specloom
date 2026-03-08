import "./imports.tsp";

using Specloom;

@entity(#{ label: "Department", pluralLabel: "Departments", titleField: "name" })
@index(#{ columns: #["id", "name"], searchable: #["name"], sortable: #["name"], clickAction: "show" })
model Department {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true, order: 10 })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true, order: 20 })
  @minLength(1)
  name: string;
}

@entity(#{ label: "Tag", pluralLabel: "Tags", titleField: "name" })
@index(#{ columns: #["id", "name", "color"], searchable: #["name"], sortable: #["name"] })
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
@index(#{ columns: #["id", "name", "email"], searchable: #["name", "email"], sortable: #["name", "email"] })
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
