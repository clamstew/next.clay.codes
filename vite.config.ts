import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";
import { resolve } from "path";

export default defineConfig({
  plugins: [remix(), netlifyPlugin(), tsconfigPaths()],
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
    noExternal: [
      "@remix-run/node",
      "@remix-run/server-runtime",
      "@remix-run/react",
      "remix-i18next",
      "react-i18next",
      "i18next",
      "i18next-browser-languagedetector",
      "i18next-http-backend",
    ],
  },
});
