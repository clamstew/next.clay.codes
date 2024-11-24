import {
  Links,
  // LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  // useRouteError,
} from "@remix-run/react";
import "~/styles/tailwind.css";

export default function App() {
  // const error = useRouteError();
  // console.error(error);
  // ``;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* <style>{`
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
        `}</style> */}
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        {/* <LiveReload /> */}
        <Scripts />
      </body>
    </html>
  );
}

// export function links() {
//   return [{ rel: "stylesheet", href: "~/styles/tailwind.css" }];
// }
