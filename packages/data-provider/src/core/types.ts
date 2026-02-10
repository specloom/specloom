export interface ListParams {
  pagination: { page: number; perPage: number };
  sort: { field: string; order: "asc" | "desc" };
  filter: Record<string, unknown>;
}

export interface ListResult<T = unknown> {
  data: T[];
  total: number;
}

export interface GetOneParams {
  id: string | number;
}

export interface CreateParams {
  data: Record<string, unknown>;
}

export interface UpdateParams {
  id: string | number;
  data: Record<string, unknown>;
}

export interface DeleteParams {
  id: string | number;
}

export interface GetManyParams {
  ids: (string | number)[];
}

export interface ResourceConfig<
  TData = unknown,
  TApiResponse = unknown,
  TApiRequest = unknown,
> {
  endpoint?: string | ((resource: string) => string);
  itemEndpoint?: (id: string | number) => string;
  transformResponse?: (raw: TApiResponse) => TData;
  transformListResponse?: (raw: unknown) => ListResult<TData>;
  transformRequest?: (data: Record<string, unknown>) => TApiRequest;
  transformFilter?: (
    filter: Record<string, unknown>,
  ) => Record<string, unknown>;
  transformSort?: (field: string) => string;
  defaultFilter?: Record<string, unknown>;
  defaultSort?: { field: string; order: "asc" | "desc" };
  actions?: Record<string, CustomAction>;
}

export type CustomAction = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: (id?: string | number) => string;
  transformRequest?: (data: unknown) => unknown;
  transformResponse?: (raw: unknown) => unknown;
};

export type ResourceConfigMap = Record<string, ResourceConfig>;
