import { createConfig } from "@netlify/remix-edge-adapter";

/** @type {import('@remix-run/dev').AppConfig} */
export default createConfig({
  serverModuleFormat: "esm",
  future: {
    v3_fetcherPersist: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true,
  },
});
