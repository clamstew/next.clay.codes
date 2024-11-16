import type { MetaFunction } from "@netlify/remix-runtime";
import App from "../components/App";
export const meta: MetaFunction = () => {
  return [
    { title: "clay.codes" },
    {
      name: "description",
      content:
        "Slowly building an online web computer about myself and interests, I guess. 🤷‍♂️",
    },
  ];
};

export default function Index() {
  return <App />;
}
