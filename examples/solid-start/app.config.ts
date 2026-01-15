import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "node-server",
  },
  vite: {
    ssr: {
      // Ark UI uses client-only APIs from solid-js/web (use, memo, template)
      // These are not available in SSR, so we need to handle this
      noExternal: ["@ark-ui/solid", "@zag-js/*"],
    },
  },
});
