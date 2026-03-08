import "../shared/imports.tsp";

using Specloom;

model ExportCatalogInput {
  @field(#{ label: "Format", form: true, order: 10 })
  @options(#[
    #{ value: "csv", label: "CSV" },
    #{ value: "json", label: "JSON" }
  ])
  format: string;

  @field(#{ label: "Include Archived", form: true, order: 20, widget: "switch" })
  includeArchived: boolean;
}

model SuspendCatalogInput {
  @field(#{ label: "Reason", form: true, order: 10, widget: "textarea" })
  @minLength(3)
  reason: string;
}
