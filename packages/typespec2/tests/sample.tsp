import "@specloom/typespec2";

using Specloom.V2;

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
@index(#{
  columns: #[
    "id",
    #{
      field: "name",
      label: "Account",
      template: "{name} <{email}>"
    }
  ],
  searchable: #["name", "email"],
  sortable: #["name", "email"],
  selection: "multi",
  clickAction: "show"
})
@namedFilter("mine", #{
  label: "Mine",
  where: #{
    field: "ownerId",
    operator: "eq",
    value: #{ context: "user.id" }
  }
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
  @filter(#["eq", "contains"])
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

@pageAction(User, #{
  id: "exportCsv",
  view: "list",
  label: "Export CSV",
  selection: "query"
}, ExportUsersInput)
op exportCsv(): string;

@rowAction(User, #{
  id: "suspend",
  label: "Suspend",
  when: "status == 'active'"
})
op suspend(): string;
