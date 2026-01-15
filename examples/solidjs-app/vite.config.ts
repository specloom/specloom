import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "path";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
      "styled-system": resolve(__dirname, "./styled-system"),
    },
  },
});
