import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";
import { resolve } from "path";

export default defineConfig({
  plugins: [netlifyPlugin(), remix(), tsconfigPaths()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "app/entry.client.tsx"),
      },
    },
  },
  ssr: {
    noExternal: ["@remix-run/react", "@remix-run/server-runtime"],
  },
});
