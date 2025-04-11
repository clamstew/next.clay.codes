/** @type {import('@remix-run/dev').AppConfig} */
export default {
  // ... other config options
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  // Use the Netlify Edge adapter
  server: "./server.ts",
  // ... other config options
  future: {
    v3_fetcherPersist: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
    v3_singleFetch: false,
  },
};
