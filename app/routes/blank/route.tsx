import type { MetaFunction } from "@netlify/remix-runtime";

export const meta: MetaFunction = () => {
  return [
    { title: "clay.codes / about:blank" },
    {
      name: "description",
      content: "If about:blank had a darkmode.",
    },
  ];
};

export default function BlankPage() {
  const handleBackgroundClick = () => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log("Error attempting to enable fullscreen:", err);
    });
  };

  return (
    <div
      className="bg-black w-full h-full absolute top-0 left-0 bottom-0 right-0"
      onClick={handleBackgroundClick}
      onKeyDown={(e) => e.key === "Enter" && handleBackgroundClick()}
      role="button"
      tabIndex={0}
      aria-label="Enter fullscreen"
    />
  );
}
