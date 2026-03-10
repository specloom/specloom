import "../shared/imports.tsp";
import "./page-actions.tsp";
import "./input-models.tsp";

using Specloom;

@action(PageActionCatalog, #{
  id: "suspendCatalog",
  label: "Suspend",
  placement: "menu",
  order: 20,
  prominence: "danger",
  confirm: #{
    message: "Suspend this record?"
  },
  when: "status == 'active'",
  disabledWhen: "locked == true"
}, SuspendCatalogInput)
op suspendCatalog(): string;

@action(PageActionCatalog, #{
  id: "reopenCatalog",
  label: "Reopen",
  placement: "menu",
  order: 30,
  prominence: "secondary",
  when: "status == 'archived'"
})
op reopenCatalog(): string;
