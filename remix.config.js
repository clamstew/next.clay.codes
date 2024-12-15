// const { createConfig } = require("@netlify/remix-edge-adapter");

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  future: {
    // v2_dev: true,
    // v2_errorBoundary: true,
    // v2_headers: true,
    // v2_meta: true,
    // v2_normalizeFormMethod: true,
    // v2_routeConvention: true,
    // v3_fetcherPersist: true,
    // v3_lazyRouteDiscovery: true,
    // v3_relativeSplatPath: true,
    // v3_singleFetch: true,
    // v3_throwAbortReason: true,
  },
};
