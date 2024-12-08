import { useCallback } from "react";
import { allCommands } from "./constants";
import { terminalCommands } from "~/db/commands/terminal-commands";
import { CommandInput } from "../sections/Home/components/CommandInput";
import { CommandSuggestions } from "../sections/Home/components/CommandSuggestions";
import { CommandOutput } from "../sections/Home/components/CommandOutput";
import { MatchedCommandOutput } from "../sections/Home/components/MatchedCommandOutput";
import { Title } from "../sections/Home/components/Title";
import { Frame } from "~/sections/Home/components/Frame";
import { FullscreenTerminal } from "../sections/Terminal/components/FullscreenTerminal";
import { CommandList } from "../sections/Terminal/components/CommandList";
import { HelpList } from "../sections/Terminal/components/HelpList";
import { SpecialCommandOutputTokens } from "../types";
import useCliState from "~/shared/utils/hooks/use-cli-state";
import { RmrfFullscreenOutput } from "~/shared/components/RmrfFullscreenOutput";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
// import { getI18nInstance } from "~/utils/i18n";

export const updateCommandPromptValue = (
  commandPromptRef: React.RefObject<HTMLInputElement>,
  value: string
) => {
  if (commandPromptRef.current) {
    commandPromptRef.current.value = value;
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // const url = new URL(request.url);
  // const searchParams = new URLSearchParams(url.search);
  // const command = searchParams.get("command") || "";
  const { i18nInstance } = await request.json();
  const promptPlaceholder = i18nInstance.t("terminal.promptPlaceholder") || "";

  return json({
    serverStrings: { promptPlaceholder: promptPlaceholder ?? "NOT_FOUND" },
  });
};

function App() {
  const {
    commandPromptRef,
    command,
    commandError,
    commandOutput,
    commandHistory,
    isFullscreenTerminal,
    setIsFullscreenTerminal,
    runCommand,
    tryAgain,
    matchingCommandTyped,
    setCommand,
    commandsThatMatchPartialCommand,
  } = useCliState();

  const handleCommandClick = useCallback(
    (cmd: string) => {
      if (commandPromptRef.current) {
        updateCommandPromptValue(commandPromptRef, cmd);
        setCommand(cmd);
        commandPromptRef.current.focus();
      }
    },
    [commandPromptRef, setCommand]
  );

  // TODO: remove this and set state in runCommand
  if (command === "rm -rf") {
    return <RmrfFullscreenOutput />;
  }

  console.log("commandOutput", commandOutput);
  console.log("commandError", commandError);

  if (isFullscreenTerminal) {
    return (
      <FullscreenTerminal
        commandHistory={commandHistory}
        commandPromptRef={commandPromptRef}
        setCommand={setCommand}
        commandError={commandError}
        commandOutput={commandOutput}
        terminalCommands={terminalCommands}
        setIsFullscreenTerminal={setIsFullscreenTerminal}
      />
    );
  }

  const hideCommandSuggestions =
    commandOutput === SpecialCommandOutputTokens.ShowCommandList ||
    commandOutput === SpecialCommandOutputTokens.ShowHelpList ||
    matchingCommandTyped ||
    commandError;

  return (
    <Frame>
      {isFullscreenTerminal && <div>Fullscreen mode activated.</div>}
      <Title
        isFullscreenTerminal={false}
        setIsFullscreenTerminal={setIsFullscreenTerminal}
      />

      <CommandInput
        commandPromptRef={commandPromptRef}
        setCommand={setCommand}
        isFullscreenTerminal={false}
      />

      {/* specialized or fallback to general output */}
      {commandOutput === SpecialCommandOutputTokens.ShowCommandList ? (
        <CommandList
          commands={allCommands}
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

      {!matchingCommandTyped && !hideCommandSuggestions && (
        <CommandSuggestions
          matchingCommands={commandsThatMatchPartialCommand.map(
            (cmd) => cmd.command
          )}
          command={command}
          tryAgain={tryAgain}
          setCommand={setCommand}
          commandPromptRef={commandPromptRef}
        />
      )}

      {matchingCommandTyped && (
        <MatchedCommandOutput
          command={command}
          runCommand={runCommand}
          tryAgain={tryAgain}
        />
      )}
    </Frame>
  );
}

export default App;
