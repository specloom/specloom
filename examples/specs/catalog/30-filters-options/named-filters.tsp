import "../shared/imports.tsp";

using Specloom;

@entity(#{ label: "Named Filters", pluralLabel: "Named Filters", titleField: "title" })
@listView(#{
  columns: #["title", "ownerId", "status", "createdAt"],
  search: #{ fields: #["title"] },
  sortable: #["title", "createdAt"],
  namedFilters: #[
    #{
      id: "mine",
      label: "Mine",
      conditions: #{
        field: "ownerId",
        operator: "eq",
        value: #{ context: "user.id" }
      }
    },
    #{
      id: "recent",
      label: "Recent",
      conditions: #{
        field: "createdAt",
        operator: "gte",
        value: #{ relative: "-7d" }
      }
    },
    #{
      id: "publishedNews",
      label: "Published News",
      conditions: #{
        and: #[
          #{ field: "status", operator: "eq", value: "published" },
          #{ field: "category", operator: "eq", value: "news" }
        ]
      }
    }
  ]
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
