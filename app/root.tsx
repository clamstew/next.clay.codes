import { signal } from "@preact/signals-react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { StrictMode } from "react";
import "~/styles/tailwind.css";
const isHydratedSignal = signal(false);

function checkHydration() {
  if (typeof window !== "undefined") {
    console.debug("[Hydration] Client-side hydration completed");
    isHydratedSignal.value = true;
  } else {
    console.debug("[Hydration] Server-side render");
  }
  return isHydratedSignal.value;
}

export default function App() {
  const hydrated = checkHydration();
  // s;

  if (!hydrated) {
    console.debug("[App] Waiting for hydration...");
    return <div>Loading...</div>; // Or a proper loading state
  }
  // const error = useRouteError();
  if (process.env.NODE_ENV === "development") {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.("Warning: Text content did not match")) {
        console.warn("[Hydration] Mismatch detected:", args);
      }
      originalError.apply(console, args);
    };
  }
  // console.error(error);
  // ``;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
}

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
              monospace;
          }
        `}</style>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

// export function links() {
//   return [{ rel: "stylesheet", href: "~/styles/tailwind.css" }];
// }

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <StrictMode>
      <html lang="en">
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          {/* add the UI you want your users to see */}
          <Scripts />
        </body>
      </html>
    </StrictMode>
  );
}
