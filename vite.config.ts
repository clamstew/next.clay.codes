import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";
import { resolve } from "path";

export default defineConfig({
  plugins: [netlifyPlugin(), remix(), tsconfigPaths()],
  // optimizeDeps: {
  //   include: ["@remix-run/node"],
  // },
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
    noExternal: ["@remix-run/react", "@remix-run/server-runtime"],
  },
});
