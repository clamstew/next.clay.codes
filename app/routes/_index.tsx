import type { MetaFunction } from "@netlify/remix-runtime";
import App from "../components/App";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <App />;
}
