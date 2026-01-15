import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import blue from "@park-ui/panda-preset/colors/blue";
import slate from "@park-ui/panda-preset/colors/slate";

export default defineConfig({
  preflight: true,
  presets: [
    createPreset({
      accentColor: blue,
      grayColor: slate,
      radius: "md",
    }),
  ],
  include: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/solidjs/src/**/*.{js,jsx,ts,tsx}",
  ],
  jsxFramework: "solid",
  outdir: "styled-system",
});
