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
  <div className="text-white border border-white box-border text-left p-[15px] text-[16px] w-[530px] md:max-w-[94%]">
    {matchingCommands.length > 0 && <div>Commands to try:</div>}
    {matchingCommands.length === 0 && (
      <div>
        No matching commands.{" "}
        <button onClick={tryAgain} className="text-[#61dafb]">
          Try again.
        </button>
      </div>
    )}
    <div className="columns-2 mt-[20px]">
      <ul className="m-0">
        {command === "" &&
          allCommands.map((cmd) => (
            <CommandExample
              key={cmd}
              cmd={cmd}
              setCommand={setCommand}
              commandPromptRef={commandPromptRef}
            />
          ))}
        {command !== "" &&
          matchingCommands.map((cmd) => (
            <CommandExample
              key={cmd}
              cmd={cmd}
              setCommand={setCommand}
              commandPromptRef={commandPromptRef}
            />
          ))}
      </ul>
    </div>
  </div>
);
