import "../shared/imports.tsp";
import "./input-models.tsp";

using Specloom;

@entity(#{ label: "Page Action Catalog", pluralLabel: "Page Action Catalog", titleField: "name" })
@index(#{ columns: #["name", "status"], searchable: #["name"], sortable: #["name"], selection: "multi", clickAction: "show" })
model PageActionCatalog {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true })
  name: string;

  @field(#{ label: "Status", list: true, show: true, form: true })
  status: string;
}

@pageAction(PageActionCatalog, #{
  id: "exportCatalog",
  view: "list",
  label: "Export Catalog",
  selection: "query",
  prominence: "secondary",
  icon: "download",
  when: "role == 'admin'"
}, ExportCatalogInput)
op exportCatalog(): string;

@pageAction(PageActionCatalog, #{
  id: "syncCatalog",
  view: "show",
  label: "Sync",
  prominence: "primary",
  confirmMessage: "Sync this record now?"
})
op syncCatalog(): string;
