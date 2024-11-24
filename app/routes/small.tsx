import type { MetaFunction } from "@netlify/remix-runtime";
import { signal, effect, computed } from "@preact/signals";
import { ChangeEvent } from "react";
import { useSignal, useComputed } from "@preact/signals-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Small | clay.codes" },
    {
      name: "description",
      content: "A simple route",
    },
  ];
};

export default function Small() {
  const command = useSignal("");
  const finalCommand = useComputed(() => command.value.toUpperCase());

  effect(() => {
    console.log("command", command.value);
    console.log("finalCommand", finalCommand.value);
  });

  const typeCommand = (e: ChangeEvent<HTMLInputElement>) => {
    command.value = e.target.value;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Type a command</h1>
      <p className="text-lg">
        This is a simple route. Type a command to see the output.
      </p>
      <input
        type="text"
        className="w-full max-w-md p-2 border border-gray-300 rounded-md"
        defaultValue={command.value}
        onChange={typeCommand}
      />

      <pre>{command}</pre>
      <pre>{finalCommand}</pre>
    </div>
  );
}
