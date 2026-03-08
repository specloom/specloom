import "../shared/imports.tsp";
import "../shared/common-models.tsp";

using Specloom;

@entity(#{ label: "Nested Many Table", pluralLabel: "Nested Many Tables", titleField: "orderNumber" })
@index(#{ columns: #["orderNumber", "lineItems"], searchable: #["orderNumber"], sortable: #["orderNumber"] })
@section("summary", #{ label: "Summary", view: "form", order: 10 })
@section("lines", #{ label: "Lines", view: "form", order: 20 })
model NestedManyTableExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Order Number", list: true, show: true, form: true, section: "summary", order: 10 })
  orderNumber: string;

  @field(#{ label: "Line Items", list: false, show: true, form: true, section: "lines", order: 20, widget: "table" })
  @nested(OrderLine, #{
    cardinality: "many",
    minItems: 1,
    maxItems: 20,
    widget: "table"
  })
  lineItems: OrderLine[];
}
