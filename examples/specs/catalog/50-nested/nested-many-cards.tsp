import "../shared/imports.tsp";
import "../shared/common-models.tsp";

using Specloom;

@entity(#{ label: "Nested Many Cards", pluralLabel: "Nested Many Cards", titleField: "title" })
@index(#{ columns: #["title", "attachments"], searchable: #["title"], sortable: #["title"] })
@section("content", #{ label: "Content", view: "form", order: 10 })
@section("attachments", #{ label: "Attachments", view: "form", order: 20 })
model NestedManyCardsExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true, section: "content", order: 10 })
  title: string;

  @field(#{ label: "Attachments", list: false, show: true, form: true, section: "attachments", order: 20, widget: "cards" })
  @nested(AttachmentCard, #{
    cardinality: "many",
    minItems: 0,
    maxItems: 8,
    widget: "cards"
  })
  attachments: AttachmentCard[];
}
