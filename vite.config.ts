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
  // build: {
  //   ssr: true,
  //   rollupOptions: {
  //     external: ["fs", "path", "crypto"],
  //   },
  // },
  ssr: {
    noExternal: [
      "@remix-run/node",
      "remix-i18next",
      "@remix-run/server-runtime",
    ],
  },
});
