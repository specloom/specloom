import { createSpecloomClient, type SpecloomClient } from "@specloom/solidjs";
import type { CompiledSpec } from "@specloom/spec";

import spec10 from "../../../specs/generated/10-basic/spec.json";
import spec20 from "../../../specs/generated/20-validation/spec.json";
import spec30 from "../../../specs/generated/30-filters-options/spec.json";
import spec40 from "../../../specs/generated/40-relations/spec.json";
import spec50 from "../../../specs/generated/50-nested/spec.json";
import spec60 from "../../../specs/generated/60-actions/spec.json";

function mergeSpecs(...specs: unknown[]): CompiledSpec {
  const merged: CompiledSpec = { version: "1", resources: {}, inputs: {} };
  for (const raw of specs) {
    const spec = raw as CompiledSpec;
    Object.assign(merged.resources, spec.resources);
    if (spec.inputs) {
      Object.assign(merged.inputs!, spec.inputs);
    }
  }
  return merged;
}

const mergedSpec = mergeSpecs(spec10, spec20, spec30, spec40, spec50, spec60);

export const specCategories: Record<string, string[]> = {
  "Basic": Object.keys((spec10 as CompiledSpec).resources),
  "Validation": Object.keys((spec20 as CompiledSpec).resources),
  "Filters & Options": Object.keys((spec30 as CompiledSpec).resources),
  "Relations": Object.keys((spec40 as CompiledSpec).resources),
  "Nested": Object.keys((spec50 as CompiledSpec).resources),
  "Actions": Object.keys((spec60 as CompiledSpec).resources),
};

export function createClient(): SpecloomClient {
  return createSpecloomClient({
    spec: mergedSpec,
    context: {
      user: { id: "admin-1", name: "Admin User", role: "admin" },
      role: "admin",
      permissions: ["read", "write", "delete"],
    },
  });
}
