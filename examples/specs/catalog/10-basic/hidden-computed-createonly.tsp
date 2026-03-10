import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Lifecycle Flags", pluralLabel: "Lifecycle Flags", titleField: "email" })
@listView(#{ columns: #["id", "email", "displayName"], search: #{ fields: #["email"], sortable: #["email"] } })
@section("account", #{ label: "Account", view: "form", order: 10 })
@section("internal", #{ label: "Internal", view: "show", order: 20 })
model LifecycleFlagsExample {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Email", list: true, show: true, form: true, section: "account", order: 10 })
  email: string;

  @field(#{ label: "Password", list: false, show: false, form: true, section: "account", order: 20, widget: "password-input" })
  @createOnly
  @minLength(8)
  password: string;

  @field(#{ label: "Display Name", list: true, show: true, form: false, readonly: true, order: 30 })
  @computed
  displayName: string;

  @field(#{ label: "Internal Memo", list: false, show: true, form: true, section: "internal", order: 40 })
  @hidden
  internalMemo?: string;
}
