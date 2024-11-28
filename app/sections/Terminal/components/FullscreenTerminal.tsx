import { RefObject } from "react";
import { CommandInput } from "../../Home/components/CommandInput";
import { CommandOutput } from "../../Home/components/CommandOutput";
import { allCommands } from "~/components/constants";
import { CommandList } from "./CommandList";

interface CommandHistoryItem {
  command: string;
  output: string;
  error: string;
}

interface FullscreenTerminalProps {
  commandHistory: CommandHistoryItem[];
  commandPromptRef: RefObject<HTMLInputElement>;
  setCommand: (command: string) => void;
  commandError: string;
  commandOutput: string;
}

export function FullscreenTerminal({
  commandHistory,
  commandPromptRef,
  setCommand,
  commandError,
  commandOutput,
}: FullscreenTerminalProps) {
  const handleCommandClick = (command: string) => {
    setCommand(command);
    if (commandPromptRef.current) {
      commandPromptRef.current.value = command;
    }
    // setCommandOutput("");
  };

  return (
    <div className="min-h-screen bg-black p-4 text-green-500 font-mono">
      {/* Command History */}
      <div className="mb-4">
        {commandHistory.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="text-white">$ {item.command}</div>
            {item.output && (
              <div dangerouslySetInnerHTML={{ __html: item.output }} />
            )}
            {item.error && <div className="text-red-500">{item.error}</div>}
          </div>
        ))}
      </div>

      {/* Current Command Output */}
      {commandOutput === "::show-command-list::" ? (
        <CommandList
          commands={allCommands}
          onCommandClick={handleCommandClick}
        />
      ) : (
        <CommandOutput error={commandError} output={commandOutput} />
      )}

      {/* Command Input */}
      <CommandInput
        commandPromptRef={commandPromptRef}
        setCommand={setCommand}
      />
    </div>
  );
}
