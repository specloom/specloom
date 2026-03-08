using TypeSpec.Reflection;

namespace Specloom.V2;

extern dec entity(target: Model, options?: valueof {
  label?: string,
  pluralLabel?: string,
  titleField?: string,
  pageSize?: int32,
  defaultSort?: {
    field: string,
    direction: "asc" | "desc"
  },
  views?: {
    list?: { enabled?: boolean },
    form?: { enabled?: boolean },
    show?: { enabled?: boolean }
  },
  client?: unknown
});

extern dec field(target: ModelProperty, options?: valueof {
  label?: string,
  widget?: string,
  appearance?: string,
  section?: string,
  order?: int32,
  list?: boolean,
  show?: boolean,
  form?: boolean,
  readonly?: boolean,
  placeholder?: string,
  help?: string,
  defaultValue?: unknown,
  format?: string,
  emptyText?: string,
  display?: {
    list?: {
      field?: string,
      template?: string
    },
    show?: {
      field?: string,
      template?: string
    }
  },
  placement?: {
    list?: string,
    show?: string,
    form?: string
  },
  client?: unknown
});

extern dec index(target: Model, options?: valueof {
  columns?: unknown[],
  searchable?: string[],
  sortable?: string[],
  defaultSort?: {
    field: string,
    direction: "asc" | "desc"
  },
  selection?: "none" | "single" | "multi",
  clickAction?: "none" | "show" | "edit"
});

extern dec filter(target: ModelProperty, options?: valueof unknown);

extern dec namedFilter(target: Model, id: valueof string, options: valueof {
  label: string,
  order?: int32,
  where: unknown
});

extern dec relation(target: ModelProperty, resource: Model, options?: valueof {
  kind?: "belongsTo" | "hasOne" | "hasMany" | "manyToMany",
  cardinality?: "one" | "many",
  labelField?: string,
  valueField?: string,
  submitField?: string,
  searchFields?: string[],
  lookupResource?: string,
  lookupOp?: string,
  linkTo?: "show" | "edit" | "none",
  creatable?: boolean,
  client?: unknown
});

extern dec nested(target: ModelProperty, resource: Model, options?: valueof {
  cardinality?: "one" | "many",
  minItems?: int32,
  maxItems?: int32,
  widget?: "inline-form" | "table" | "cards"
});

extern dec section(target: Model, id: valueof string, options: valueof {
  label: string,
  order?: int32,
  view?: "form" | "show",
  placement?: string,
  collapsible?: boolean,
  defaultCollapsed?: boolean
});

extern dec hidden(target: ModelProperty);
extern dec computed(target: ModelProperty);
extern dec createOnly(target: ModelProperty);

extern dec options(target: ModelProperty, options: valueof {
  value: string | int32 | float64 | boolean,
  label: string
}[]);

extern dec optionSource(target: ModelProperty, options: valueof {
  resource?: string,
  labelField: string,
  valueField: string,
  searchFields?: string[]
});

extern dec pageAction(
  target: Operation,
  resource: Model,
  options: valueof {
    id?: string,
    view?: "list" | "show" | "form",
    label?: string,
    placement?: string,
    order?: int32,
    icon?: string,
    prominence?: "primary" | "secondary" | "subtle" | "danger",
    confirmMessage?: string,
    selection?: "none" | "selected" | "query",
    args?: unknown,
    when?: string,
    disabledWhen?: string,
    client?: unknown
  },
  input?: Model
);

extern dec rowAction(
  target: Operation,
  resource: Model,
  options: valueof {
    id?: string,
    view?: "list",
    label?: string,
    placement?: string,
    order?: int32,
    icon?: string,
    prominence?: "primary" | "secondary" | "subtle" | "danger",
    confirmMessage?: string,
    args?: unknown,
    when?: string,
    disabledWhen?: string,
    client?: unknown
  },
  input?: Model
);

extern dec visibleWhen(target: ModelProperty, expression: valueof string);
extern dec requiredWhen(target: ModelProperty, expression: valueof string);
extern dec readonlyWhen(target: ModelProperty, expression: valueof string);
extern dec disabledWhen(target: ModelProperty | Operation, expression: valueof string);
extern dec match(target: ModelProperty, fieldName: valueof string);

extern dec rule(target: Model, options: valueof {
  kind: string,
  fields?: string[],
  field?: string,
  left?: string,
  right?: string,
  operator?: string,
  when?: string,
  message?: string
});
