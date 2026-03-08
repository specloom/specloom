import type { UiConfig } from "./types.js";

export function createUiConfig(config: UiConfig = {}): UiConfig {
  return {
    defaults: {
      fieldRenderers: config.defaults?.fieldRenderers ?? {},
      actionRenderers: config.defaults?.actionRenderers ?? {},
      sectionRenderer: config.defaults?.sectionRenderer,
      columnRenderer: config.defaults?.columnRenderer,
    },
    resources: config.resources ?? {},
  };
}
