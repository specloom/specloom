import type { DataProvider } from "@specloom/data-provider";
import type { ResourceResolver } from "@specloom/solidjs";
import { generateMockData } from "./mock-data";

export function createMockDataProvider(
  resolveResource: ResourceResolver,
): DataProvider {
  return {
    async getList(resource, params) {
      const compiled = await resolveResource(resource);
      const all = generateMockData(compiled);
      const { page, perPage } = params.pagination;
      const start = (page - 1) * perPage;
      const data = all.slice(start, start + perPage);
      return { data, page, perPage, total: all.length };
    },
    async getOne(resource, params) {
      const compiled = await resolveResource(resource);
      const all = generateMockData(compiled);
      const keyField = findKeyField(compiled);
      return all.find((r) => r[keyField] === params.id) ?? {};
    },
    async create(_resource, params) {
      return params.data;
    },
    async update(_resource, params) {
      return { id: params.id, ...params.data };
    },
    async delete(_resource, params) {
      return { id: params.id };
    },
  };
}

function findKeyField(resource: { fields: Record<string, { key?: boolean; name: string }> }): string {
  for (const f of Object.values(resource.fields)) {
    if (f.key) return f.name;
  }
  return "id";
}
