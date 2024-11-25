import { useEffect, useRef, useState, useCallback } from "react";
import { goSiteToCommands, terminalCommands, allCommands } from "./constants";
import { getMatchingCommands } from "../shared/utils/commands-utils";
import { CommandInput } from "../sections/Home/components/CommandInput";
import { CommandSuggestions } from "../sections/Home/components/CommandSuggestions";
import { CommandOutput } from "../sections/Home/components/CommandOutput";
import { MatchedCommandOutput } from "../sections/Home/components/MatchedCommandOutput";
import { Title } from "../sections/Home/components/Title";
import { Frame } from "~/sections/Home/components/Frame";

interface CommandHistoryItem {
  command: string;
  output: string;
}

const detectMatchingCommandFound = (
  matchingCommands: string[],
  command: string
): boolean => {
  return matchingCommands.length === 1 && matchingCommands[0] === command;
};

function App() {
  const commandPromptRef = useRef<HTMLInputElement>(null);
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>(
    []
  );
  const [isFullscreenTerminal, setIsFullscreenTerminal] = useState(false);

  const runCommand = useCallback(
    (command: string) => {
      let output = "";
      if (goSiteToCommands[command as keyof typeof goSiteToCommands]) {
        output = `Opening site: ${
          goSiteToCommands[command as keyof typeof goSiteToCommands]
        }`;
        setCommandOutput(output);
        // delay for a hot second, so user can see the output
        setTimeout(() => {
          window.open(
            goSiteToCommands[command as keyof typeof goSiteToCommands],
            "_blank"
          );
        }, 600);
      } else if (command === terminalCommands.history) {
        // print history
        const historyString = `${commandHistory
          .map((historyItem) => historyItem.command)
          .join("<br />")}<br />${command}`;
        setCommandOutput(historyString);
      } else if (command === terminalCommands.fullscreen) {
        document.documentElement.requestFullscreen();
        setCommandOutput("Fullscreen mode activated.");
      } else if (command === terminalCommands.minimize) {
        document.exitFullscreen();
        setCommandOutput("Minimized mode activated.");
      } else if (command === terminalCommands.clear) {
        setCommandOutput("");
        setCommand("");
        setIsFullscreenTerminal(false);
        if (commandPromptRef.current) {
          commandPromptRef.current.value = "";
        }
        document.exitFullscreen();
      } else if (command === terminalCommands.terminal) {
        setCommandOutput("Terminal mode activated.");
        setIsFullscreenTerminal(true);
      } else if (command === terminalCommands.exit) {
        setIsFullscreenTerminal(false);
      } else {
        output = `bash: command not found: ${command}`;
        setCommandError(output);
      }

      // add command to command history
      setCommandHistory([...commandHistory, { command, output }]);
    },
    [commandHistory]
  );

  useEffect(() => {
    const currentCommandPromptRef = commandPromptRef.current;
    if (!currentCommandPromptRef) return;

    currentCommandPromptRef.focus();

    const runCommandAlias = runCommand;

    const keyUpEventListener = (event: KeyboardEvent) => {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "what am i typing:",
          (event.target as HTMLInputElement).value
        );
      }
      // TODO: will run command highlighting here
    };

    const keyDownEventListener = (event: KeyboardEvent) => {
      if (event.which === 27 && event.shiftKey === false) {
        event.preventDefault();
        setCommand("");
        setCommandError("");
        setCommandOutput("");
        // @FIXME - need to clear input value
      } else if (event.which === 13 && event.shiftKey === false) {
        event.preventDefault();
        runCommandAlias(command.toLowerCase());
      } else {
        setCommandError("");
        setCommandOutput("");
      }
    };

    // Add event listener
    currentCommandPromptRef.addEventListener("keyup", keyUpEventListener);
    currentCommandPromptRef.addEventListener("keydown", keyDownEventListener);

    return () => {
      currentCommandPromptRef.removeEventListener("keyup", keyUpEventListener);
      currentCommandPromptRef.removeEventListener(
        "keydown",
        keyDownEventListener
      );
    };
  }, [command, commandHistory, runCommand]);

  const commandsThatMatchPartialCommand = getMatchingCommands(
    command,
    allCommands
  );

  const tryAgain = () => {
    setCommand("");
    setCommandError("");
    setCommandOutput("");
    if (commandPromptRef.current) {
      commandPromptRef.current.value = "";
    }
  };

  const matchingCommandTyped = detectMatchingCommandFound(
    commandsThatMatchPartialCommand,
    command
  );

  if (isFullscreenTerminal) {
    return (
      <div className="h-screen w-screen bg-[#282c34] text-white">
        <div>Fullscreen mode activated.</div>

        <input
          ref={commandPromptRef}
          spellCheck="false"
          onChange={(e) => setCommand(e.target.value)}
          placeholder="run a command ..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="bg-[#282c34] text-white border border-white box-border text-left p-[15px] text-[16px] w-[530px] md:max-w-[94%]"
        />

        <CommandOutput error={commandError} output={commandOutput} />
      </div>
    );
  }

  return (
    <Frame>
      {isFullscreenTerminal && <div>Fullscreen mode activated.</div>}
      <Title />

      <CommandInput
        commandPromptRef={commandPromptRef}
        setCommand={setCommand}
      />

      <CommandOutput error={commandError} output={commandOutput} />

      {!matchingCommandTyped && (
        <CommandSuggestions
          matchingCommands={commandsThatMatchPartialCommand}
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
