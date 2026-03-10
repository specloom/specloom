import "../shared/imports.tsp";
import "../shared/common-models.tsp";

using Specloom;

@entity(#{ label: "Nested One", pluralLabel: "Nested Ones", titleField: "name" })
@listView(#{ columns: #["name", "shippingAddress"], search: #{ fields: #["name"], sortable: #["name"] } })
@section("profile", #{ label: "Profile", view: "form", order: 10 })
@section("shipping", #{ label: "Shipping", view: "form", order: 20 })
model NestedOneInlineExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true, section: "profile", order: 10 })
  name: string;

  @field(#{ label: "Shipping Address", list: false, show: true, form: true, section: "shipping", order: 20, widget: "inline-form" })
  @nested(Address, #{
    cardinality: "one",
    widget: "inline-form"
  })
  shippingAddress: Address;
}
