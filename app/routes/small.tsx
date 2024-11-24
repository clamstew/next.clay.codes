import type { MetaFunction } from "@netlify/remix-runtime";
import { effect } from "@preact/signals";
import { ChangeEvent } from "react";
import { useSignal, useComputed } from "@preact/signals-react";
import { allCommands } from "~/components/constants";
import { getMatchingCommands } from "../shared/utils/commands-utils";

export const meta: MetaFunction = () => {
  return [
    { title: "Small | clay.codes" },
    {
      name: "description",
      content: "A simple route",
    },
  ];
};
const detectMatchingCommandFound = (
  matchingCommands: string[],
  command: string
): boolean => {
  return matchingCommands.length === 1 && matchingCommands[0] === command;
};

export default function Small() {
  const command = useSignal("");
  const finalCommand = useComputed(() => command.value?.toUpperCase() ?? "");
  //   const commandsThatMatchPartialCommand = useComputed(
  //     () => getMatchingCommands(command.value, allCommands) ?? []
  //   );
  //   const matchingCommandTyped = useComputed(
  //     () =>
  //       detectMatchingCommandFound(
  //         commandsThatMatchPartialCommand.value,
  //         command.value
  //       ) ?? false
  //   );

  //   effect(() => {
  //     // console.log("allCommands:", allCommands);
  //     console.log("command", command.value);
  //     console.log("finalCommand", finalCommand.value);
  //     console.log(
  //       "commandsThatMatchPartialCommand",
  //       commandsThatMatchPartialCommand.value
  //     );
  //     console.log(
  //       "Type isArray:",
  //       Array.isArray(commandsThatMatchPartialCommand.value)
  //     );
  //     console.log("matchingCommandTyped", matchingCommandTyped.value);
  //   });

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
