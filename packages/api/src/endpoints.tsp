// ============================================================
// API Endpoints
// ============================================================

import "@typespec/http";
import "./response.tsp";
import "./error.tsp";

using Http;

namespace SpecloomApi;

@route("/{resource}")
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

@route("/{resource}")
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

@route("/{resource}/{id}/actions")
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

@route("/{resource}/bulk-actions")
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
