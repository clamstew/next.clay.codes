import { RefObject } from "react";
import { CommandInput } from "../../Home/components/CommandInput";
import { CommandOutput } from "../../Home/components/CommandOutput";
import { allCommands } from "~/components/constants";
import { CommandList } from "./CommandList";
import { HelpList } from "./HelpList";
import { SpecialCommandOutputTokens } from "~/types";
import type { Command, CommandHistoryItem } from "~/types";
import { Title } from "~/sections/Home/components/Title";
// import { useTranslation } from "react-i18next";

interface FullscreenTerminalProps {
  commandHistory: CommandHistoryItem[];
  commandPromptRef: RefObject<HTMLInputElement>;
  setCommand: (command: string) => void;
  commandError: string;
  commandOutput: string;
  terminalCommands: Record<string, Command>;
  setIsFullscreenTerminal: (isFullscreenTerminal: boolean) => void;
  setCommandOutput: (commandOutput: string) => void;
}

export function FullscreenTerminal({
  commandHistory,
  commandPromptRef,
  setCommand,
  commandError,
  commandOutput,
  setCommandOutput,
  terminalCommands,
  setIsFullscreenTerminal,
}: FullscreenTerminalProps) {
  // const { t } = useTranslation("common");

  const handleCommandClick = (command: string) => {
    setCommand(command);
    if (commandPromptRef.current) {
      commandPromptRef.current.value = command;
    }
    // setCommandOutput("");
  };

  return (
    <>
      <div className="absolute top-0 right-0 z-10">
        <Title
          isFullscreenTerminal={true}
          // setIsFullscreenTerminal={setIsFullscreenTerminal}
          onTitleClick={() => {
            // assume is fullscreen terminal
            // and we need to clear the latest command output
            // and set the fullscreen terminal to false
            setCommandOutput("");
            setIsFullscreenTerminal(false);
          }}
        />
      </div>
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
        {commandOutput === SpecialCommandOutputTokens.ShowCommandList ? (
          <CommandList
            commands={[...Object.values(allCommands)]}
            onCommandClick={handleCommandClick}
          />
        ) : commandOutput === SpecialCommandOutputTokens.ShowHelpList ? (
          <HelpList
            commands={terminalCommands}
            onCommandClick={handleCommandClick}
          />
        ) : (
          <CommandOutput error={commandError} output={commandOutput} />
        )}

        {/* Command Input */}
        <CommandInput
          commandPromptRef={commandPromptRef}
          setCommand={setCommand}
          isFullscreenTerminal={true}
        />

        {/* <div
          dangerouslySetInnerHTML={{
            __html: t("terminal.postFullscreenActivated"),
          }}
        /> */}
      </div>
    </>
  );
}
