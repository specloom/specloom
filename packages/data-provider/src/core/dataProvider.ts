import type {
  ListParams,
  ListResult,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  GetManyParams,
} from "./types.js";

export interface DataProvider {
  getList<T = unknown>(
    resource: string,
    params: ListParams,
  ): Promise<ListResult<T>>;
  getOne<T = unknown>(resource: string, params: GetOneParams): Promise<T>;
  create<T = unknown>(resource: string, params: CreateParams): Promise<T>;
  update<T = unknown>(resource: string, params: UpdateParams): Promise<T>;
  delete<T = unknown>(resource: string, params: DeleteParams): Promise<T>;
  getMany?<T = unknown>(resource: string, params: GetManyParams): Promise<T[]>;
}
