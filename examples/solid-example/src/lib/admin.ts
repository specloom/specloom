import { createAdmin, validateSpec } from "specloom";
import type { Spec } from "specloom";
import { createMockDataProvider } from "./mock-provider";
import { mockData } from "./mock-data";

import shopSpec from "../../../specs/generated/@specloom/typespec/shop.json";
import commonSpec from "../../../specs/generated/@specloom/typespec/common.json";
import userSpec from "../../../specs/generated/@specloom/typespec/user.json";

function mergeSpecs(...specs: Spec[]): Spec {
  return {
    version: "0.1",
    resources: specs.flatMap((s) => s.resources),
    views: specs.flatMap((s) => s.views),
  };
}

// Strip unknown fields from view columns/fields to handle spec inconsistencies
function sanitizeSpec(raw: Spec): Spec {
  const fieldsByResource = new Map<string, Set<string>>();
  for (const r of raw.resources) {
    fieldsByResource.set(r.name, new Set(r.fields.map((f) => f.name)));
  }

  const views = raw.views.map((v) => {
    const fields = fieldsByResource.get(v.resource);
    if (!fields) return v;

    if (v.type === "list" && "columns" in v) {
      return {
        ...v,
        columns: (v.columns as string[]).filter((c) => fields.has(c)),
        sortable: "sortable" in v ? (v.sortable as string[]).filter((c) => fields.has(c)) : undefined,
      };
    }
    if ((v.type === "form" || v.type === "show") && "fields" in v) {
      return {
        ...v,
        fields: (v.fields as string[]).filter((f) => fields.has(f)),
      };
    }
    return v;
  });

  return { ...raw, views };
}

const raw = mergeSpecs(
  commonSpec as unknown as Spec,
  userSpec as unknown as Spec,
  shopSpec as unknown as Spec,
);

const spec = validateSpec(sanitizeSpec(raw));

export const admin = createAdmin(spec, { role: "admin" });
export const dataProvider = createMockDataProvider(spec, { seedData: mockData });
export { spec };
