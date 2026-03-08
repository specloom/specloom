import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Model Rules", pluralLabel: "Model Rules", titleField: "name" })
@index(#{ columns: #["name", "email", "phone", "startDate", "endDate"], sortable: #["name", "startDate"] })
@rule(#{ kind: "requireOneOf", fields: #["email", "phone"], message: "Email or phone is required" })
@rule(#{ kind: "requiredIf", field: "reason", when: "status == 'inactive'", message: "Reason is required for inactive records" })
@rule(#{ kind: "mutuallyExclusive", fields: #["email", "slackId"], message: "Email and Slack ID cannot both be set" })
@rule(#{ kind: "requiredTogether", fields: #["startDate", "endDate"], message: "Start and end date must be set together" })
@rule(#{ kind: "comparison", left: "endDate", operator: ">=", right: "startDate", message: "End date must be after start date" })
model ModelRulesExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Name", list: true, show: true, form: true })
  name: string;

  @field(#{ label: "Status", list: true, show: true, form: true })
  status?: string;

  @field(#{ label: "Email", list: true, show: true, form: true })
  email?: string;

  @field(#{ label: "Phone", list: false, show: true, form: true })
  phone?: string;

  @field(#{ label: "Slack ID", list: false, show: true, form: true })
  slackId?: string;

  @field(#{ label: "Reason", list: false, show: true, form: true })
  reason?: string;

  @field(#{ label: "Start Date", list: true, show: true, form: true })
  startDate?: utcDateTime;

  @field(#{ label: "End Date", list: true, show: true, form: true })
  endDate?: utcDateTime;
}
