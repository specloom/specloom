using TypeSpec.Reflection;

namespace S;

// ============================================================
// Resource Decorators
// ============================================================

/**
 * Mark a model as a resource
 * @param name Optional resource name (defaults to model name)
 */
extern dec resource(target: Model, name?: valueof string);

/**
 * Require at least one field in the group
 * @param fields Field names that require at least one non-empty value
 */
extern dec requiredOneOf(target: Model, fields: valueof string[]);

/**
 * Set display label
 * @param label Display label
 */
extern dec label(target: Model | ModelProperty, label: valueof string);

/**
 * Set field kind
 * @param kind Field kind (text, longText, enum, relation, etc.)
 */
extern dec kind(target: ModelProperty, kind: valueof string);

/**
 * Set enum options
 * @param options Array of {value, label} objects
 */
extern dec options(target: ModelProperty, options: valueof {value: string, label: string}[]);

/**
 * Define relation to another resource
 * @param resource Related resource model
 * @param options Relation options
 */
extern dec relation(target: ModelProperty, resource: Model, options?: valueof {
  labelField?: string,
  valueField?: string,
  searchable?: boolean
});

/**
 * Set relation cardinality (legacy alias, usually inferred from type)
 * Prefer @relation(..., #{ ... }) as canonical syntax.
 * @param cardinality "one" or "many"
 */
extern dec cardinality(target: ModelProperty, cardinality: valueof "one" | "many");

/**
 * Set UI hints
 * @param options UI options
 */
extern dec ui(target: Model | ModelProperty, options: valueof {
  hint?: string,
  inputHint?: string,
  format?: string,
  link?: boolean,
  icon?: string,
  variant?: string,
  searchable?: boolean
});

/**
 * Set UI hint (legacy alias of @ui(#{ hint: ... }))
 * Prefer @ui as canonical syntax.
 * @param hint UI hint
 */
extern dec hint(target: ModelProperty, hint: valueof string);

/**
 * Set UI input hint (legacy alias of @ui(#{ inputHint: ... }))
 * Prefer @ui as canonical syntax.
 * @param inputHint UI input hint
 */
extern dec inputHint(target: ModelProperty, inputHint: valueof string);

/**
 * Mark field as readonly
 */
extern dec readonly(target: ModelProperty);

/**
 * Mark field as computed (not stored in DB)
 */
extern dec computed(target: ModelProperty);

/**
 * Mark field as create-only (only shown on create form, hidden on edit)
 */
extern dec createOnly(target: ModelProperty);

/**
 * Make field filterable
 * @param operators Optional list of allowed operators
 */
extern dec filter(target: ModelProperty, operators?: valueof string[]);

// ============================================================
// View Decorators
// ============================================================

/**
 * Define a view for a resource
 * @param resource Resource model
 * @param viewType View type (list, form, show)
 */
extern dec view(target: Model, resource: Model, viewType: valueof "list" | "form" | "show");

/**
 * Set list view columns
 * @param columns Array of field names
 */
extern dec columns(target: Model, columns: valueof string[]);

/**
 * Set form/show view fields
 * @param fields Array of field names
 */
extern dec fields(target: Model, fields: valueof string[]);

/**
 * Set searchable fields
 * @param fields Array of field names
 */
extern dec searchable(target: Model, fields: valueof string[]);

/**
 * Set sortable fields
 * @param fields Array of field names
 */
extern dec sortable(target: Model, fields: valueof string[]);

/**
 * Set default sort
 * @param field Sort field
 * @param order Sort order
 */
extern dec defaultSort(target: Model, field: valueof string, order: valueof "asc" | "desc");

/**
 * Set row click action
 * @param action Action ID
 */
extern dec clickAction(target: Model, action: valueof string);

/**
 * Set selection mode
 * @param mode Selection mode
 */
extern dec selection(target: Model, mode: valueof "none" | "single" | "multi");

/**
 * Set named filters
 * @param filters Array of named filters
 */
extern dec namedFilters(target: Model, filters: valueof {id: string, label: string, filter: unknown}[]);

/**
 * Add a named filter
 * @param id Filter ID
 * @param label Display label
 * @param filter Filter condition
 */
extern dec namedFilter(target: Model, id: valueof string, label: valueof string, filter: valueof unknown);

// ============================================================
// Action Decorators (View-level)
// ============================================================

/**
 * Define a page-level action on a view
 * @param id Action ID
 * @param options Action options
 * @param dialogModel Optional dialog model for input
 */
extern dec action(target: Model, id: valueof string, options: valueof {
  label?: string,
  allowedWhen?: string,
  confirm?: string,
  selection?: string,
  ui?: { icon?: string, variant?: string },
  dialog?: { title?: string, description?: string },
  api?: { path: string, method?: string, body?: string[], params?: unknown, query?: unknown }
}, dialogModel?: Model);

/**
 * Define a row action on a list view
 * @param id Action ID
 * @param options Action options
 * @param dialogModel Optional dialog model for input
 */
extern dec rowAction(target: Model, id: valueof string, options: valueof {
  label?: string,
  allowedWhen?: string,
  confirm?: string,
  ui?: { icon?: string, variant?: string },
  dialog?: { title?: string, description?: string },
  api?: { path: string, method?: string, body?: string[], params?: unknown, query?: unknown }
}, dialogModel?: Model);

/**
 * Set conditional visibility expression (field is shown only when expression is true)
 * @param expression Visibility expression
 */
extern dec visibleWhen(target: ModelProperty, expression: valueof string);

/**
 * Set conditional required expression (field becomes required when expression is true)
 * @param expression Required expression
 */
extern dec requiredWhen(target: ModelProperty, expression: valueof string);

/**
 * Set field match validation (for confirm password, etc.)
 * @param field Field name to match
 */
extern dec match(target: ModelProperty, field: valueof string);

// ============================================================
// Validation Decorators
// ============================================================

/**
 * Mark field as required
 */
extern dec required(target: ModelProperty);

/**
 * Set minimum value
 * @param value Minimum value
 */
extern dec min(target: ModelProperty, value: valueof int32);

/**
 * Set maximum value
 * @param value Maximum value
 */
extern dec max(target: ModelProperty, value: valueof int32);

/**
 * Set minimum string length
 * @param value Minimum length
 */
extern dec minLength(target: ModelProperty, value: valueof int32);

/**
 * Set maximum string length
 * @param value Maximum length
 */
extern dec maxLength(target: ModelProperty, value: valueof int32);

/**
 * Set pattern constraint
 * @param pattern Pattern name or regex
 */
extern dec pattern(target: ModelProperty, pattern: valueof string);

/**
 * Set minimum array items
 * @param value Minimum items
 */
extern dec minItems(target: ModelProperty, value: valueof int32);

/**
 * Set maximum array items
 * @param value Maximum items
 */
extern dec maxItems(target: ModelProperty, value: valueof int32);
