import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Conditional Validation", pluralLabel: "Conditional Validations", titleField: "status" })
@index(#{ columns: #["status", "reason", "adminNote"], sortable: #["status"] })
@section("status", #{ label: "Status", view: "form", order: 10 })
@section("security", #{ label: "Security", view: "form", order: 20 })
model ConditionalValidationExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Status", list: true, show: true, form: true, section: "status", order: 10 })
  @options(#[
    #{ value: "draft", label: "Draft" },
    #{ value: "published", label: "Published" },
    #{ value: "archived", label: "Archived" }
  ])
  status: string;

  @field(#{ label: "Reason", list: false, show: true, form: true, section: "status", order: 20 })
  @visibleWhen("status == 'archived'")
  @requiredWhen("status == 'archived'")
  reason?: string;

  @field(#{ label: "Password", list: false, show: false, form: true, section: "security", order: 30 })
  @minLength(8)
  password?: string;

  @field(#{ label: "Password Confirm", list: false, show: false, form: true, section: "security", order: 40 })
  @match("password")
  passwordConfirm?: string;

  @field(#{ label: "Admin Note", list: false, show: true, form: true, section: "security", order: 50 })
  @readonlyWhen("role != 'admin'")
  adminNote?: string;

  @field(#{ label: "Archive Note", list: false, show: true, form: true, section: "security", order: 60 })
  @disabledWhen("status == 'archived'")
  archiveNote?: string;
}
