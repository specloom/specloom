import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Named Filters", pluralLabel: "Named Filters", titleField: "title" })
@index(#{ columns: #["title", "ownerId", "status", "createdAt"], searchable: #["title"], sortable: #["title", "createdAt"] })
@namedFilter("mine", #{
  label: "Mine",
  where: #{
    field: "ownerId",
    operator: "eq",
    value: #{ context: "user.id" }
  }
})
@namedFilter("recent", #{
  label: "Recent",
  where: #{
    field: "createdAt",
    operator: "gte",
    value: #{ relative: "-7d" }
  }
})
@namedFilter("publishedNews", #{
  label: "Published News",
  where: #{
    and: #[
      #{ field: "status", operator: "eq", value: "published" },
      #{ field: "category", operator: "eq", value: "news" }
    ]
  }
})
model NamedFiltersExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "Title", list: true, show: true, form: true })
  title: string;

  @field(#{ label: "Owner", list: false, show: true, form: true })
  ownerId?: string;

  @field(#{ label: "Status", list: true, show: true, form: true })
  status?: string;

  @field(#{ label: "Category", list: true, show: true, form: true })
  category?: string;

  @field(#{ label: "Created At", list: true, show: true, form: false })
  createdAt: utcDateTime;
}
