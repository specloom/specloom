// app.config.ts
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  server: {
    preset: "node-server"
  },
  vite: {
    ssr: {
      // Ark UI uses client-only APIs from solid-js/web (use, memo, template)
      // These are not available in SSR, so we need to handle this
      noExternal: ["@ark-ui/solid", "@zag-js/*"]
    }
  }
});
export {
  app_config_default as default
};
