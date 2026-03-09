import "../shared/imports.tsp";

using Specloom;

@entity(#{
  label: "Task",
  pluralLabel: "Tasks",
  titleField: "title",
  defaultSort: #{ field: "id", direction: "desc" }
})
@index(#{
  columns: #["id", "title", "priority", "done", "dueDate", "createdAt"],
  searchable: #["title", "description"],
  sortable: #["id", "title", "priority", "dueDate", "createdAt"],
  clickAction: "show",
  namedFilters: #[
    #{ id: "incomplete", label: "未完了", conditions: #{
      field: "done", operator: "eq", value: false
    }},
    #{ id: "highPriority", label: "高優先", conditions: #{
      field: "priority", operator: "eq", value: "high"
    }},
    #{ id: "overdue", label: "期限切れ", conditions: #{
      and: #[
        #{ field: "done", operator: "eq", value: false },
        #{ field: "dueDate", operator: "lt", value: #{ relative: "0d" } }
      ]
    }}
  ]
})
@section("main", #{ label: "基本情報", view: "form", order: 10 })
@section("detail", #{ label: "詳細", view: "form", order: 20 })
model Task {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "タイトル", list: true, show: true, form: true, section: "main", order: 10 })
  @filter(#["contains"])
  @minLength(1)
  @maxLength(200)
  title: string;

  @field(#{ label: "説明", list: false, show: true, form: true, section: "detail", order: 10, widget: "textarea" })
  @maxLength(2000)
  description?: string;

  @field(#{ label: "優先度", list: true, show: true, form: true, section: "main", order: 20, widget: "select" })
  @filter(#{ operators: #["eq"], widget: "select" })
  @options(#[
    #{ value: "low", label: "低" },
    #{ value: "medium", label: "中" },
    #{ value: "high", label: "高" }
  ])
  priority: string;

  @field(#{ label: "完了", list: true, show: true, form: true, section: "main", order: 30, widget: "switch" })
  @filter(#["eq"])
  done: boolean;

  @field(#{ label: "見積り時間 (h)", list: false, show: true, form: true, section: "detail", order: 20, widget: "number-input" })
  @minValue(0)
  @maxValue(999)
  estimatedHours?: float32;

  @field(#{ label: "期限日", list: true, show: true, form: true, section: "main", order: 40, widget: "date" })
  @filter(#["gte", "lte"])
  dueDate?: plainDate;

  @field(#{ label: "タグ", list: false, show: true, form: true, section: "detail", order: 30 })
  @minItems(0)
  @maxItems(10)
  tags: string[];

  @field(#{ label: "メモ", list: false, show: false, form: true, section: "detail", order: 40, widget: "textarea" })
  @pattern("^[^<>]*$")
  memo?: string;

  @field(#{ label: "作成日時", list: true, show: true, form: false, readonly: true, order: 90, format: "datetime" })
  @filter(#["gte", "lte"])
  createdAt: utcDateTime;

  @field(#{ label: "更新日時", list: false, show: true, form: false, readonly: true, order: 91, format: "relative" })
  updatedAt: utcDateTime;
}
