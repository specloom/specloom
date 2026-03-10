import "../shared/imports.tsp";

using Specloom;

@entity(#{
  label: "Task",
  pluralLabel: "Tasks",
  titleField: "title",
  pageSize: 5,
  defaultSort: #{ field: "id", direction: "desc" }
})
@listView(#{
  columns: #["id", "title", "priority", "done", "dueDate", "createdAt"],
  search: #{ fields: #["title", "description"] },
  filters: #[
    #{ field: "title", operators: #["contains"] },
    #{ field: "priority", operators: #["eq"], widget: "select" },
    #{ field: "done", operators: #["eq"] },
    #{ field: "dueDate", operators: #["gte", "lte"], widget: "date-range" },
    #{ field: "createdAt", operators: #["gte", "lte"], widget: "date-range" }
  ],
  sortable: #["id", "title", "priority", "dueDate", "createdAt"],
  pageSizeOptions: #[5, 10, 20],
  selection: "multi",
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
  ],
  pageActions: #[
    #{ ref: "exportCsv", selection: "query", order: 10 },
    #{ ref: "reviewOverdue", selection: "query", order: 20 },
    #{ ref: "archiveCompleted", selection: "query", order: 30 },
    #{ ref: "markSelectedDone", selection: "selected", order: 40 }
  ],
  rowActions: #[
    #{ ref: "markDone", order: 10 }
  ]
})
@section("main", #{ label: "基本情報", view: "form", order: 10 })
@section("detail", #{ label: "詳細", view: "form", order: 20 })
model Task {
  @key
  @field(#{ label: "ID", list: true, show: true, form: false, readonly: true })
  id: string;

  @field(#{ label: "タイトル", list: true, show: true, form: true, section: "main", order: 10 })
  @minLength(1)
  @maxLength(200)
  title: string;

  @field(#{ label: "説明", list: false, show: true, form: true, section: "detail", order: 10, widget: "textarea" })
  @maxLength(2000)
  description?: string;

  @field(#{ label: "優先度", list: true, show: true, form: true, section: "main", order: 20, widget: "select" })
  @options(#[
    #{ value: "low", label: "低" },
    #{ value: "medium", label: "中" },
    #{ value: "high", label: "高" }
  ])
  priority: string;

  @field(#{ label: "完了", list: true, show: true, form: true, section: "main", order: 30, widget: "switch" })
  done: boolean;

  @field(#{ label: "見積り時間 (h)", list: false, show: true, form: true, section: "detail", order: 20, widget: "number-input" })
  @minValue(0)
  @maxValue(999)
  estimatedHours?: float32;

  @field(#{ label: "期限日", list: true, show: true, form: true, section: "main", order: 40, widget: "date" })
  dueDate?: plainDate;

  @field(#{ label: "タグ", list: false, show: true, form: true, section: "detail", order: 30 })
  @minItems(0)
  @maxItems(10)
  tags: string[];

  @field(#{ label: "メモ", list: false, show: false, form: true, section: "detail", order: 40, widget: "textarea" })
  @pattern("^[^<>]*$")
  memo?: string;

  @field(#{ label: "作成日時", list: true, show: true, form: false, readonly: true, order: 90, format: "datetime" })
  createdAt: utcDateTime;

  @field(#{ label: "更新日時", list: false, show: true, form: false, readonly: true, order: 91, format: "relative" })
  updatedAt: utcDateTime;
}

@action(Task, #{
  id: "exportCsv",
  label: "CSVエクスポート",
  prominence: "secondary",
  icon: "download"
})
op exportTaskCsv(): string;

@action(Task, #{
  id: "reviewOverdue",
  label: "期限切れを再確認",
  prominence: "secondary",
  icon: "refresh-cw",
  confirm: #{
    message: "現在の条件で期限切れタスクを再確認しますか？"
  }
})
op reviewOverdueTasks(): string;

@action(Task, #{
  id: "archiveCompleted",
  label: "完了済みをアーカイブ",
  prominence: "danger",
  icon: "archive",
  confirm: #{
    title: "完了済みをアーカイブ",
    message: "完了済みタスクをアーカイブしますか？",
    confirmLabel: "アーカイブ"
  }
})
op archiveCompletedTasks(): string;

@action(Task, #{
  id: "markSelectedDone",
  label: "選択したタスクを完了",
  prominence: "primary",
  icon: "check",
  confirm: #{
    message: "選択したタスクを完了にしますか？",
    confirmLabel: "完了にする"
  }
})
op markSelectedTasksDone(): string;

@action(Task, #{
  id: "markDone",
  label: "完了にする",
  prominence: "secondary",
  icon: "check",
  when: "done == false",
  confirm: #{
    message: "このタスクを完了にしますか？",
    confirmLabel: "完了にする"
  }
})
op markTaskDone(): string;
