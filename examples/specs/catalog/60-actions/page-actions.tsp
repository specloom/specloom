import "../shared/imports.tsp";
import "./input-models.tsp";

using Specloom;

@entity(#{ label: "Page Action Catalog", pluralLabel: "Page Action Catalog", titleField: "name" })
@listView(#{
  columns: #["name", "status"],
  search: #{ fields: #["name"] },
  sortable: #["name"],
  selection: "multi",
  clickAction: "show",
  pageActions: #[
    #{ ref: "exportCatalog", selection: "query" }
  ],
  rowActions: #[
    "suspendCatalog",
    "reopenCatalog"
  ]
})
@showView(#{
  pageActions: #["syncCatalog"]
})
model PageActionCatalog {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true })
  name: string;

  @field(#{ label: "Status", list: true, show: true, form: true })
  status: string;
}

@action(PageActionCatalog, #{
  id: "exportCatalog",
  label: "Export Catalog",
  prominence: "secondary",
  icon: "download",
  when: "role == 'admin'"
}, ExportCatalogInput)
op exportCatalog(): string;

@action(PageActionCatalog, #{
  id: "syncCatalog",
  label: "Sync",
  prominence: "primary",
  confirm: #{
    message: "Sync this record now?"
  }
})
op syncCatalog(): string;
