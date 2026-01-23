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
extern dec relation(target: ModelProperty, resource: Model, options?: valueof {labelField?: string});

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
 * Mark field as readonly
 */
extern dec readonly(target: ModelProperty);

/**
 * Mark field as computed (not stored in DB)
 */
extern dec computed(target: ModelProperty);

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
// Action Decorators
// ============================================================

/**
 * Define an action (for page-level actions)
 * @param id Action ID
 */
extern dec action(target: ModelProperty, id: valueof string);

/**
 * Define a row action (for list view row actions)
 * @param id Action ID
 */
extern dec rowAction(target: ModelProperty, id: valueof string);

/**
 * Set selection requirement for bulk actions
 * @param target Selection target ("selected" for selected rows, "query" for all filtered rows)
 */
extern dec requiresSelection(target: ModelProperty, selection: valueof "selected" | "query");

/**
 * Set permission expression
 * @param expression Permission expression
 */
extern dec allowedWhen(target: ModelProperty, expression: valueof string);

/**
 * Set confirmation message
 * @param message Confirmation message
 */
extern dec confirm(target: ModelProperty, message: valueof string);

/**
 * Define a dialog for an action
 * @param dialogModel Dialog fields model
 * @param options Dialog options (title, description)
 */
extern dec dialog(target: ModelProperty, dialogModel: Model, options?: valueof {
  title?: string,
  description?: string
});

/**
 * Define API endpoint for an action
 * @param options API options (path, method, params, body, query)
 */
extern dec api(target: ModelProperty, options: valueof {
  path: string,
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  params?: unknown,
  body?: string[],
  query?: unknown
});

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
 * Set minimum length
 * @param value Minimum length
 */
extern dec minLength(target: ModelProperty, value: valueof int32);

/**
 * Set maximum length
 * @param value Maximum length
 */
extern dec maxLength(target: ModelProperty, value: valueof int32);

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
 * Set regex pattern
 * @param pattern Regex pattern (email, url, tel, or custom)
 */
extern dec pattern(target: ModelProperty, pattern: valueof string);

/**
 * Set minimum items (for arrays)
 * @param value Minimum items
 */
extern dec minItems(target: ModelProperty, value: valueof int32);

/**
 * Set maximum items (for arrays)
 * @param value Maximum items
 */
extern dec maxItems(target: ModelProperty, value: valueof int32);
