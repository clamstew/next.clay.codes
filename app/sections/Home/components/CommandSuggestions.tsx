import { CommandExample } from "./CommandExample";
import { allCommands } from "../../../components/constants";

interface CommandSuggestionsProps {
  matchingCommands: string[];
  command: string;
  tryAgain: () => void;
  setCommand: (cmd: string) => void;
  commandPromptRef: React.RefObject<HTMLInputElement>;
}

export const CommandSuggestions = ({
  matchingCommands,
  command,
  tryAgain,
  setCommand,
  commandPromptRef,
}: CommandSuggestionsProps) => (
  <div className="text-white border border-white box-border text-left p-[15px] text-[16px] w-[100%] [@media(min-width:530px)]:w-[530px] max-w-[100%]">
    {(matchingCommands.length > 0 || command === "") && (
      <h2 className="font-bold">Commands to try:</h2>
    )}
    {command !== "" && matchingCommands.length === 0 && (
      <div>
        No matching commands.{" "}
        <button onClick={tryAgain} className="text-[#61dafb]">
          Try again.
        </button>
      </div>
    )}
    <div className="columns-1 [@media(min-width:400px)]:columns-2 mt-[10px] hidden [@media(min-width:60px)]:block">
      <ul className="m-0">
        {command === "" &&
          allCommands.map((cmd) => (
            <CommandExample
              key={cmd.command}
              cmd={cmd}
              setCommand={setCommand}
              commandPromptRef={commandPromptRef}
            />
          ))}
        {command !== "" &&
          matchingCommands.map((cmd) => (
            <CommandExample
              key={cmd}
              cmd={allCommands.find((c) => c.command === cmd)!}
              setCommand={setCommand}
              commandPromptRef={commandPromptRef}
            />
          ))}
      </ul>
    </div>
    <div className="block [@media(min-width:60px)]:hidden text-center text-2xl">
      😖
    </div>
  </div>
);
