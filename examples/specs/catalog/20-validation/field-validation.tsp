import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Field Validation", pluralLabel: "Field Validations", titleField: "name" })
@listView(#{ columns: #["name", "email", "age"], search: #{ fields: #["name", "email"], sortable: #["name", "age"] } })
@section("basic", #{ label: "Basic", view: "form", order: 10 })
model FieldValidationExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true, section: "basic", order: 10 })
  @minLength(1)
  @maxLength(100)
  name: string;

  @field(#{ label: "Email", list: true, show: true, form: true, section: "basic", order: 20 })
  @pattern("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
  email?: string;

  @field(#{ label: "Age", list: true, show: true, form: true, section: "basic", order: 30, widget: "number-input" })
  @minValue(18)
  @maxValue(65)
  age?: int32;

  @field(#{ label: "Tags", list: false, show: true, form: true, section: "basic", order: 40 })
  @minItems(1)
  @maxItems(5)
  tags: string[];
}
