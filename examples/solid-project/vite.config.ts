import { defineConfig } from "vite";
import path from "path";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

const pkgRoot = path.resolve(__dirname, "../../packages");

export default defineConfig({
  plugins: [
    solidStart(),
    tailwindcss(),
    nitro()
  ],
  resolve: {
    alias: {
      "@specloom/solidjs": path.join(pkgRoot, "solidjs/src/index.ts"),
      "@specloom/spec": path.join(pkgRoot, "spec/src/index.ts"),
      "@specloom/auth-provider": path.join(pkgRoot, "auth-provider/src/index.ts"),
      "@specloom/data-provider": path.join(pkgRoot, "data-provider/src/index.ts"),
      "specloom": path.join(pkgRoot, "specloom/src/index.ts"),
    },
  },
});
