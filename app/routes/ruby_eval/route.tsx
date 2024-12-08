import { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const formData = await request.formData();
  const code = formData.get("code");

  if (!code || typeof code !== "string") {
    return new Response("Code is required", { status: 400 });
  }

  // TODO: Add Ruby evaluation logic here

  return new Response("Not implemented", { status: 501 });
}
