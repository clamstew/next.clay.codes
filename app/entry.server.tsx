import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import ReactDOMServer from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Response(
    "<!DOCTYPE html>" +
      ReactDOMServer.renderToString(
        <RemixServer context={remixContext} url={request.url} />
      ),
    {
      headers: responseHeaders,
      status: responseStatusCode,
    }
  );
}
