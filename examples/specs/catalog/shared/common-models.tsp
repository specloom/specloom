import "./imports.tsp";

using Specloom;

model Address {
  @field(#{ label: "Line 1", form: true, show: true, order: 10 })
  line1: string;

  @field(#{ label: "City", form: true, show: true, order: 20 })
  city: string;

  @field(#{ label: "Postal Code", form: true, show: true, order: 30 })
  postalCode: string;
}

model OrderLine {
  @field(#{ label: "SKU", form: true, show: true, order: 10 })
  sku: string;

  @field(#{ label: "Name", form: true, show: true, order: 20 })
  name: string;

  @field(#{ label: "Quantity", form: true, show: true, order: 30, widget: "number-input" })
  @minValue(1)
  quantity: int32;
}

model AttachmentCard {
  @field(#{ label: "Title", form: true, show: true, order: 10 })
  title: string;

  @field(#{ label: "URL", form: true, show: true, order: 20, appearance: "link" })
  url: string;
}
