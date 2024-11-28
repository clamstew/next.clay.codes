import { RefObject } from "react";
import { CommandInput } from "../sections/Home/components/CommandInput";
import { CommandOutput } from "../sections/Home/components/CommandOutput";

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
      <CommandOutput error={commandError} output={commandOutput} />

      {/* Command Input */}
      <CommandInput
        commandPromptRef={commandPromptRef}
        setCommand={setCommand}
      />
    </div>
  );
}
