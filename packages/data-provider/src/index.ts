export type { DataProvider } from "./core/index.js";
export type {
  ListParams,
  ListResult,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  GetManyParams,
  ResourceConfig,
  ResourceConfigMap,
  CustomAction,
} from "./core/index.js";

export { createHttpClient } from "./http/index.js";
export type { HttpClient, HttpClientConfig } from "./http/index.js";
