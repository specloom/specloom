import {
  createSpecloomRuntime,
  type SpecloomRuntime,
  type ResourceResolver,
} from "@specloom/solidjs"
import { loadResource } from "./resource-catalog"
import { createMockDataProvider } from "./mock-data-provider"

const resolveResource: ResourceResolver = async (name) => {
  const resource = await loadResource(name)
  if (!resource) throw new Error(`Unknown resource: ${name}`)
  return resource
}

export function createRuntime(): SpecloomRuntime {
  return createSpecloomRuntime({
    resolveResource,
    dataProvider: createMockDataProvider(resolveResource),
    context: {
      user: { id: "admin-1", name: "Admin User", role: "admin" },
      role: "admin",
      permissions: ["read", "write", "delete"],
    },
  })
}
