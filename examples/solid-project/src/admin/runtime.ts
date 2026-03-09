import {
  createSpecloomRuntime,
  type SpecloomRuntime,
} from "@specloom/solidjs"

export function createRuntime(): SpecloomRuntime {
  return createSpecloomRuntime({
    context: {
      user: { id: "admin-1", name: "Admin User", role: "admin" },
      role: "admin",
      permissions: ["read", "write", "delete"],
    },
  })
}
