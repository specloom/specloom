import "../shared/imports.tsp";

using Specloom;

@entity(#{
  label: "UI Metadata",
  pluralLabel: "UI Metadata",
  titleField: "headline",
  views: #{
    list: #{ enabled: true },
    form: #{ enabled: true },
    show: #{ enabled: true }
  },
  client: #{
    analyticsKey: "ui-metadata"
  }
})
@listView(#{
  columns: #[
    #{
      field: "headline",
      label: "Headline",
      template: "{headline} ({status})",
      sortable: true,
      placement: "primary"
    },
    "slug",
    "status"
  ],
  search: #{ fields: #["headline", "slug"] },
  sortable: #["headline", "status"],
  clickAction: "edit"
})
@section("content", #{ label: "Content", view: "form", order: 10 })
@section("seo", #{ label: "SEO", view: "form", order: 20, placement: "side" })
@section("preview", #{ label: "Preview", view: "show", order: 30, collapsible: true, defaultCollapsed: true })
model UiMetadataExample {
  @key
  @field(#{ label: "ID", list: false, show: true, form: false, readonly: true })
  id: string;

  @field(#{
    label: "Headline",
    widget: "text-input",
    section: "content",
    order: 10,
    list: true,
    show: true,
    form: true,
    placeholder: "Launch announcement",
    help: "Primary headline shown in cards and detail page",
    placement: #{
      list: "primary",
      show: "hero",
      form: "main"
    },
    client: #{
      analyticsKey: "headline"
    }
  })
  headline: string;

  @field(#{
    label: "Slug",
    widget: "slug-input",
    section: "seo",
    order: 20,
    list: true,
    show: true,
    form: true,
    placeholder: "launch-announcement",
    emptyText: "-",
    client: #{
      normalize: "slug"
    }
  })
  slug: string;

  @field(#{
    label: "Summary",
    widget: "textarea",
    section: "content",
    order: 30,
    list: false,
    show: true,
    form: true,
    help: "Short teaser used in list cards"
  })
  summary?: string;

  @field(#{
    label: "Status",
    widget: "badge-select",
    appearance: "badge",
    section: "seo",
    order: 40,
    list: true,
    show: true,
    form: true,
    defaultValue: "draft",
    display: #{
      list: #{ template: "Status: {status}" },
      show: #{ field: "status" }
    }
  })
  @options(#[
    #{ value: "draft", label: "Draft" },
    #{ value: "review", label: "Review" },
    #{ value: "published", label: "Published" }
  ])
  status: string;
}
