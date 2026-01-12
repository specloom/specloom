import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

using Http;
using OpenAPI;

@service({
  title: "Specloom Admin API",
})
@server(
  "{baseUrl}/{prefix}",
  "Specloom Admin API Server",
  {
    baseUrl: url = "http://localhost:3000",
    prefix: string = "api",
  }
)
namespace SpecloomApi;

// ============================================================
// Common Types
// ============================================================

model Pagination {
  page: int32;
  per_page: int32;
  total: int32;
  total_pages: int32;
}

model Sort {
  field: string;
  order: "asc" | "desc";
}

model Meta {
  timestamp: utcDateTime;
}

model Option {
  value: string;
  label: string;
}

model FieldUI {
  hint?: string;
  input_hint?: string;
  searchable?: boolean;
}

model ActionUI {
  icon?: string;
  variant?: string;
}

model Validation {
  required?: boolean;
  min_length?: int32;
  max_length?: int32;
  min?: float64;
  max?: float64;
  pattern?: string;
  min_items?: int32;
  max_items?: int32;
}

// ============================================================
// ViewModel Types
// ============================================================

model ActionVM {
  id: string;
  label: string;
  allowed: boolean;
  confirm?: string;
  ui?: ActionUI;
}

model RowVM {
  id: string;
  values: Record<unknown>;
  actions: ActionVM[];
}

model ListFieldVM {
  name: string;
  label: string;
  kind: string;
  sortable?: boolean;
  ui?: FieldUI;
  options?: Option[];
}

model NamedFilter {
  id: string;
  label: string;
  active: boolean;
}

model Filters {
  named: NamedFilter[];
}

model Selection {
  mode: "single" | "multi" | "none";
  selected: string[];
}

model Search {
  fields: string[];
  query: string;
}

model ListViewModel {
  type: "list";
  resource: string;
  label: string;
  fields: ListFieldVM[];
  header_actions: ActionVM[];
  rows: RowVM[];
  filters: Filters;
  selection: Selection;
  search: Search;
}

model ShowFieldVM {
  name: string;
  label: string;
  kind: string;
  value: unknown;
  ui?: FieldUI;
  options?: Option[];
}

model ShowViewModel {
  type: "show";
  resource: string;
  label: string;
  id: string;
  fields: ShowFieldVM[];
  actions: ActionVM[];
}

model FormFieldVM {
  name: string;
  label: string;
  kind: string;
  value: unknown;
  required: boolean;
  readonly: boolean;
  validation?: Validation;
  errors: string[];
  ui?: FieldUI;
  options?: Option[];
}

model FormViewModel {
  type: "form";
  resource: string;
  label: string;
  mode: "create" | "edit";
  id?: string;
  fields: FormFieldVM[];
  actions: ActionVM[];
  is_valid: boolean;
  is_dirty: boolean;
}

// ============================================================
// API Response Types
// ============================================================

model ListResponse {
  data: ListViewModel;
  pagination: Pagination;
  sort: Sort;
  meta: Meta;
}

model ShowResponse {
  data: ShowViewModel;
  meta: Meta;
}

model FormResponse {
  data: FormViewModel;
  meta: Meta;
}

model SaveResponse {
  data: {
    id: string;
    ...Record<unknown>;
  };
  meta: Meta;
}

model ActionResponse {
  data: {
    success: boolean;
    message?: string;
  };
  meta: Meta;
}

model BulkActionResult {
  id: string;
  success: boolean;
  error?: string;
}

model BulkActionResponse {
  data: {
    success_count: int32;
    failure_count: int32;
    results: BulkActionResult[];
  };
  meta: Meta;
}

model ErrorDetail {
  /** 表示用エラーメッセージ */
  message: string;

  /** エラー位置（JSON Path 形式: "title", "tags[0].name"） */
  field?: string;

  /** エラー種別（i18n / プログラム判定用） */
  code?: string;

  /** 制限値などのパラメータ（i18n 組み立て用） */
  params?: Record<unknown>;
}

model ErrorBody {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
  meta: Meta;
}

@error
model ValidationError {
  @statusCode statusCode: 422;
  ...ErrorBody;
}

@error
model NotFoundError {
  @statusCode statusCode: 404;
  ...ErrorBody;
}

@error
model ForbiddenError {
  @statusCode statusCode: 403;
  ...ErrorBody;
}

@error
model UnauthorizedError {
  @statusCode statusCode: 401;
  ...ErrorBody;
}

@error
model ConflictError {
  @statusCode statusCode: 409;
  ...ErrorBody;
}

@error
model InternalError {
  @statusCode statusCode: 500;
  ...ErrorBody;
}

// ============================================================
// API Endpoints
// ============================================================

@route("/api/{resource}")
@tag("Resource")
interface ResourceApi {
  @summary("List resources")
  @get
  list(
    @path resource: string,
    @query page?: int32 = 1,
    @query per_page?: int32 = 20,
    @query sort?: string,
    @query order?: "asc" | "desc",
    @query search?: string,
    @query filter?: string,
  ): ListResponse | NotFoundError | ForbiddenError | UnauthorizedError | InternalError;

  @summary("Create resource")
  @post
  create(
    @path resource: string,
    @body body: Record<unknown>,
  ): SaveResponse | ValidationError | ForbiddenError | UnauthorizedError | InternalError;

  @summary("Show resource")
  @get
  @route("/{id}")
  show(
    @path resource: string,
    @path id: string,
  ): ShowResponse | NotFoundError | ForbiddenError | UnauthorizedError | InternalError;

  @summary("Update resource")
  @put
  @route("/{id}")
  update(
    @path resource: string,
    @path id: string,
    @body body: Record<unknown>,
  ): SaveResponse | ValidationError | NotFoundError | ForbiddenError | UnauthorizedError | ConflictError | InternalError;

  @summary("Delete resource")
  @delete
  @route("/{id}")
  delete(
    @path resource: string,
    @path id: string,
  ): ActionResponse | NotFoundError | ForbiddenError | UnauthorizedError | InternalError;
}

@route("/api/{resource}")
@tag("Form")
interface FormApi {
  @summary("Get create form")
  @get
  @route("/new")
  newForm(
    @path resource: string,
  ): FormResponse | NotFoundError | ForbiddenError | UnauthorizedError | InternalError;

  @summary("Get edit form")
  @get
  @route("/{id}/edit")
  editForm(
    @path resource: string,
    @path id: string,
  ): FormResponse | NotFoundError | ForbiddenError | UnauthorizedError | InternalError;
}

@route("/api/{resource}/{id}/actions")
@tag("Action")
interface ActionApi {
  @summary("Execute action")
  @post
  @route("/{action_id}")
  execute(
    @path resource: string,
    @path id: string,
    @path action_id: string,
    @body body?: {
      confirmed?: boolean;
    },
  ): ActionResponse | ValidationError | NotFoundError | ForbiddenError | UnauthorizedError | ConflictError | InternalError;
}

@route("/api/{resource}/bulk-actions")
@tag("Bulk Action")
interface BulkActionApi {
  @summary("Execute bulk action")
  @post
  @route("/{action_id}")
  execute(
    @path resource: string,
    @path action_id: string,
    @body body: {
      ids: string[];
      confirmed?: boolean;
    },
  ): BulkActionResponse | ValidationError | ForbiddenError | UnauthorizedError | InternalError;
}
