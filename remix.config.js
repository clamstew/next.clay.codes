const { createConfig } = require("@netlify/remix-edge-adapter");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = createConfig({
  serverModuleFormat: "esm",
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
  // ... other config options
});
