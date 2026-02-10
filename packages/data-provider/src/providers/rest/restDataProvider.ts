import type { DataProvider } from "../../core/dataProvider.js";
import type {
  ResourceConfig,
  ResourceConfigMap,
  ListParams,
  ListResult,
} from "../../core/types.js";
import type { HttpClient } from "../../http/httpClient.js";

export interface RestDataProviderOptions {
  apiPrefix?: string;
  resources?: ResourceConfigMap;
  defaultConfig?: Partial<ResourceConfig>;
}

type ActionExecutor = (
  resource: string,
  action: string,
  id?: string | number,
  data?: unknown,
) => Promise<unknown>;

export function createRestDataProvider(
  http: HttpClient,
  options: RestDataProviderOptions = {},
): DataProvider & { action: ActionExecutor } {
  const { apiPrefix = "/api", resources = {}, defaultConfig = {} } = options;

  function getConfig(resource: string): ResourceConfig {
    return { ...defaultConfig, ...resources[resource] };
  }

  function resolveEndpoint(resource: string, config: ResourceConfig): string {
    if (typeof config.endpoint === "function")
      return config.endpoint(resource);
    if (typeof config.endpoint === "string") return config.endpoint;
    return `${apiPrefix}/${resource}`;
  }

  function resolveItemEndpoint(
    resource: string,
    id: string | number,
    config: ResourceConfig,
  ): string {
    if (config.itemEndpoint) return config.itemEndpoint(id);
    return `${resolveEndpoint(resource, config)}/${id}`;
  }

  function buildQuery(params: ListParams, config: ResourceConfig): string {
    const { page, perPage } = params.pagination;
    const sortField = config.transformSort
      ? config.transformSort(params.sort.field)
      : params.sort.field;
    const rawFilter = { ...config.defaultFilter, ...params.filter };
    const filter = config.transformFilter
      ? config.transformFilter(rawFilter)
      : rawFilter;

    const query = new URLSearchParams({
      _page: String(page),
      _limit: String(perPage),
      _sort: sortField,
      _order: params.sort.order,
      ...Object.fromEntries(
        Object.entries(filter).map(([k, v]) => [k, String(v)]),
      ),
    });
    return query.toString();
  }

  function transformOne<T>(raw: unknown, config: ResourceConfig): T {
    return config.transformResponse
      ? (config.transformResponse(raw) as T)
      : (raw as T);
  }

  function transformList<T>(raw: unknown, config: ResourceConfig): ListResult<T> {
    if (config.transformListResponse)
      return config.transformListResponse(raw) as ListResult<T>;
    const obj = raw as Record<string, unknown>;
    const list = (obj.data as unknown[]) ?? raw;
    const data = Array.isArray(list)
      ? list.map((item: unknown) => transformOne<T>(item, config))
      : [];
    const total = (obj.total as number) ?? data.length;
    return { data, total };
  }

  function transformReq(
    data: Record<string, unknown>,
    config: ResourceConfig,
  ): unknown {
    return config.transformRequest ? config.transformRequest(data) : data;
  }

  const provider: DataProvider = {
    async getList<T>(
      resource: string,
      params: ListParams,
    ): Promise<ListResult<T>> {
      const config = getConfig(resource);
      const effectiveParams: ListParams = {
        ...params,
        sort: params.sort ?? config.defaultSort ?? { field: "id", order: "asc" },
      };
      const endpoint = resolveEndpoint(resource, config);
      const query = buildQuery(effectiveParams, config);
      const raw = await http.get<unknown>(`${endpoint}?${query}`);
      return transformList<T>(raw, config);
    },

    async getOne<T>(
      resource: string,
      params: { id: string | number },
    ): Promise<T> {
      const config = getConfig(resource);
      const endpoint = resolveItemEndpoint(resource, params.id, config);
      const raw = await http.get<unknown>(endpoint);
      return transformOne<T>(raw, config);
    },

    async create<T>(
      resource: string,
      params: { data: Record<string, unknown> },
    ): Promise<T> {
      const config = getConfig(resource);
      const endpoint = resolveEndpoint(resource, config);
      const body = transformReq(params.data, config);
      const raw = await http.post<unknown>(endpoint, body);
      return transformOne<T>(raw, config);
    },

    async update<T>(
      resource: string,
      params: { id: string | number; data: Record<string, unknown> },
    ): Promise<T> {
      const config = getConfig(resource);
      const endpoint = resolveItemEndpoint(resource, params.id, config);
      const body = transformReq(params.data, config);
      const raw = await http.put<unknown>(endpoint, body);
      return transformOne<T>(raw, config);
    },

    async delete<T>(
      resource: string,
      params: { id: string | number },
    ): Promise<T> {
      const config = getConfig(resource);
      const endpoint = resolveItemEndpoint(resource, params.id, config);
      const raw = await http.delete<unknown>(endpoint);
      return transformOne<T>(raw, config);
    },
  };

  const action: ActionExecutor = async (resource, actionName, id, data) => {
    const config = getConfig(resource);
    const actionDef = config.actions?.[actionName];
    if (!actionDef)
      throw { message: `Unknown action: ${resource}.${actionName}` };

    const path = actionDef.path(id);
    const body =
      data && actionDef.transformRequest
        ? actionDef.transformRequest(data)
        : data;

    let raw: unknown;
    switch (actionDef.method) {
      case "GET":
        raw = await http.get(path);
        break;
      case "POST":
        raw = await http.post(path, body);
        break;
      case "PUT":
        raw = await http.put(path, body);
        break;
      case "PATCH":
        raw = await http.put(path, body);
        break;
      case "DELETE":
        raw = await http.delete(path);
        break;
      default:
        raw = await http.post(path, body);
    }

    return actionDef.transformResponse ? actionDef.transformResponse(raw) : raw;
  };

  return { ...provider, action };
}
