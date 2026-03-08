import type {
  DataProvider,
  ListParams,
  ListResult,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  GetManyParams,
} from "@specloom/data-provider";
import type { Spec, Field, Resource } from "specloom";

type Row = Record<string, unknown>;

// --- Spec-driven mock data generation ---

function generateFieldValue(field: Field, index: number, allResources: Resource[]): unknown {
  if (field.readonly && field.name === "id") {
    return `${index + 1}`;
  }
  if (field.readonly && field.kind === "datetime") {
    const d = new Date(2024, 0, 1 + index * 30);
    return d.toISOString();
  }

  // enum / status: pick from options
  if ((field.kind === "enum" || field.kind === "status") && field.options?.length) {
    return field.options[index % field.options.length].value;
  }

  // relation: generate related object with id + labelField
  if (field.kind === "relation" && field.relation) {
    const relResource = allResources.find((r) => r.name === field.relation!.resource);
    const labelField = field.relation.labelField ?? "name";
    const valueField = field.relation.valueField;

    if (valueField) {
      // scalar relation (e.g., prefectureCode)
      return `val-${index + 1}`;
    }
    // id-based relation (default) - return scalar id or object based on type
    if (field.type === "int32" || field.type === "int64" || field.type === "float64") {
      return index + 1;
    }
    if (relResource) {
      // Model-type relation: return object
      return { id: `${index + 1}`, [labelField]: `${field.relation.resource} ${index + 1}` };
    }
    return index + 1;
  }

  // by kind
  switch (field.kind) {
    case "text":
      return `${field.label ?? field.name} ${index + 1}`;
    case "longText":
      return `${field.label ?? field.name}の詳細テキスト ${index + 1}`;
    case "email":
      return `user${index + 1}@example.com`;
    case "tel":
      return `03-${String(1000 + index).padStart(4, "0")}-${String(5000 + index).padStart(4, "0")}`;
    case "url":
      return `https://example.com/${field.name}/${index + 1}`;
    case "password":
      return `password${index + 1}`;
    case "number":
    case "integer":
      return (index + 1) * 10;
    case "currency":
      return (index + 1) * 1000000;
    case "percent":
      return (index + 1) * 0.1;
    case "boolean":
      return index % 2 === 0;
    case "date": {
      const d = new Date(2020 + index, index % 12, 1 + index);
      return d.toISOString().split("T")[0];
    }
    case "datetime": {
      const d = new Date(2024, index, 1 + index, 9 + index);
      return d.toISOString();
    }
    case "time":
      return `${String(9 + index).padStart(2, "0")}:00`;
    case "image":
      return `https://placehold.co/100x100?text=${index + 1}`;
    default:
      break;
  }

  // by type fallback
  switch (field.type) {
    case "string":
      return `${field.label ?? field.name} ${index + 1}`;
    case "int32":
    case "int64":
      return (index + 1) * 10;
    case "float64":
      return (index + 1) * 1.5;
    case "boolean":
      return index % 2 === 0;
    case "date":
      return new Date(2020 + index, 0, 1).toISOString().split("T")[0];
    case "datetime":
      return new Date(2024, index, 1).toISOString();
    default:
      return `${field.name}-${index + 1}`;
  }
}

function generateRows(resource: Resource, count: number, allResources: Resource[]): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    const row: Row = {};
    for (const field of resource.fields) {
      row[field.name] = generateFieldValue(field, i, allResources);
    }
    rows.push(row);
  }
  return rows;
}

// --- DataProvider implementation ---

function compareValues(a: unknown, b: unknown, order: "asc" | "desc"): number {
  const av = a == null ? "" : a;
  const bv = b == null ? "" : b;
  if (typeof av === "number" && typeof bv === "number") {
    return order === "desc" ? bv - av : av - bv;
  }
  const cmp = String(av).localeCompare(String(bv), "ja");
  return order === "desc" ? -cmp : cmp;
}

function matchesFilter(row: Row, filter: Record<string, unknown>): boolean {
  return Object.entries(filter).every(([key, value]) => {
    if (value === undefined || value === null || value === "") return true;
    return String(row[key]) === String(value);
  });
}

export function createMockDataProvider(
  spec: Spec,
  options?: {
    rowCounts?: Record<string, number>;
    seedData?: Record<string, Row[]>;
  },
): DataProvider {
  const stores: Record<string, Row[]> = {};
  let nextIdCounter = 1000;

  // Initialize stores: use seed data if available, otherwise auto-generate
  for (const resource of spec.resources) {
    if (options?.seedData?.[resource.name]) {
      stores[resource.name] = [...options.seedData[resource.name]];
    } else {
      const count = options?.rowCounts?.[resource.name] ?? 5;
      stores[resource.name] = generateRows(resource, count, spec.resources);
    }
  }

  function getStore(resource: string): Row[] {
    const store = stores[resource];
    if (!store) throw new Error(`Unknown resource: ${resource}`);
    return store;
  }

  return {
    async getList<T = unknown>(
      resource: string,
      params: ListParams,
    ): Promise<ListResult<T>> {
      let data = [...getStore(resource)];

      if (params.filter && Object.keys(params.filter).length > 0) {
        data = data.filter((row) => matchesFilter(row, params.filter));
      }

      if (params.sort?.field) {
        data.sort((a, b) =>
          compareValues(a[params.sort.field], b[params.sort.field], params.sort.order),
        );
      }

      const total = data.length;
      const { page, perPage } = params.pagination;
      const start = (page - 1) * perPage;
      data = data.slice(start, start + perPage);

      return { data: data as T[], total };
    },

    async getOne<T = unknown>(resource: string, params: GetOneParams): Promise<T> {
      const store = getStore(resource);
      const item = store.find((r) => String(r.id) === String(params.id));
      if (!item) throw new Error(`${resource} not found: ${params.id}`);
      return item as T;
    },

    async create<T = unknown>(resource: string, params: CreateParams): Promise<T> {
      const store = getStore(resource);
      const newItem = {
        ...params.data,
        id: String(nextIdCounter++),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.push(newItem);
      return newItem as T;
    },

    async update<T = unknown>(resource: string, params: UpdateParams): Promise<T> {
      const store = getStore(resource);
      const idx = store.findIndex((r) => String(r.id) === String(params.id));
      if (idx === -1) throw new Error(`${resource} not found: ${params.id}`);
      store[idx] = { ...store[idx], ...params.data, updatedAt: new Date().toISOString() };
      return store[idx] as T;
    },

    async delete<T = unknown>(resource: string, params: DeleteParams): Promise<T> {
      const store = getStore(resource);
      const idx = store.findIndex((r) => String(r.id) === String(params.id));
      if (idx === -1) throw new Error(`${resource} not found: ${params.id}`);
      const [deleted] = store.splice(idx, 1);
      return deleted as T;
    },

    async getMany<T = unknown>(resource: string, params: GetManyParams): Promise<T[]> {
      const store = getStore(resource);
      const ids = new Set(params.ids.map(String));
      return store.filter((r) => ids.has(String(r.id))) as T[];
    },
  };
}
