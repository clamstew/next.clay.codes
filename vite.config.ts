import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";
import { resolve } from "path";

export default defineConfig({
  plugins: [remix(), netlifyPlugin(), tsconfigPaths()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
    },
  },
});
