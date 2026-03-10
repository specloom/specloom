import "@specloom/typespec";

using Specloom;

model ExportUsersInput {
  @field(#{ label: "Status", form: true })
  status: string;
}

@entity(#{
  label: "User",
  pluralLabel: "Users",
  titleField: "name",
  defaultSort: #{ field: "name", direction: "asc" }
})
@listView(#{
  columns: #[
    "id",
    #{
      field: "name",
      label: "Account",
      template: "{name} <{email}>"
    }
  ],
  search: #{ fields: #["name", "email"] },
  filters: #[
    #{ field: "name", operators: #["eq", "contains"] }
  ],
  sortable: #["name", "email"],
  selection: "multi",
  clickAction: "show",
  namedFilters: #[
    #{
      id: "mine",
      label: "Mine",
      conditions: #{
        field: "ownerId",
        operator: "eq",
        value: #{ context: "user.id" }
      }
    }
  ],
  pageActions: #[
    #{ ref: "exportCsv", selection: "query" }
  ],
  rowActions: #["suspend"]
})
@section("basic", #{ label: "Basic", view: "form", order: 10 })
model User {
  @key
  @field(#{
    label: "ID",
    list: true,
    show: true,
    form: false,
    readonly: true,
    order: 10
  })
  id: string;

  @field(#{
    label: "Name",
    list: true,
    show: true,
    form: true,
    section: "basic",
    order: 20
  })
  @minLength(1)
  name: string;

  @field(#{
    label: "Email",
    list: true,
    show: true,
    form: true,
    section: "basic",
    order: 30,
    appearance: "link"
  })
  email: string;

  @field(#{
    label: "Department",
    list: true,
    show: true,
    form: true,
    order: 40
  })
  @relation(Department, #{
    kind: "belongsTo",
    labelField: "name",
    valueField: "id",
    submitField: "departmentId",
    linkTo: "show"
  })
  departmentId?: string;

  @field(#{
    label: "Addresses",
    form: true,
    order: 50,
    widget: "inline-form"
  })
  @nested(Address, #{
    cardinality: "many",
    minItems: 1,
    maxItems: 3,
    widget: "table"
  })
  addresses: Address[];

  @field(#{
    label: "Display Name",
    list: true,
    show: true,
    readonly: true,
    order: 60
  })
  @computed
  displayName: string;
}

@entity(#{ label: "Department" })
model Department {
  @field(#{ label: "Name", list: true, show: true, form: true })
  name: string;
}

model Address {
  @field(#{ label: "Line 1", form: true, show: true })
  line1: string;
}

@action(User, #{
  id: "exportCsv",
  label: "Export CSV"
}, ExportUsersInput)
op exportCsv(): string;

@action(User, #{
  id: "suspend",
  label: "Suspend",
  when: "status == 'active'"
})
op suspend(): string;
