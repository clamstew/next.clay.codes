import { useEffect, useRef, useState, useCallback } from "react";
import { goSiteToCommands, terminalCommands, allCommands } from "./constants";
import { getMatchingCommands } from "../shared/utils/commands-utils";
import { CommandInput } from "../sections/Home/components/CommandInput";
import { CommandSuggestions } from "../sections/Home/components/CommandSuggestions";
import { CommandOutput } from "../sections/Home/components/CommandOutput";
import { MatchedCommandOutput } from "../sections/Home/components/MatchedCommandOutput";
import { Title } from "../sections/Home/components/Title";
import { Frame } from "~/sections/Home/components/Frame";
import { FullscreenTerminal } from "../sections/Terminal/components/FullscreenTerminal";
import { CommandList } from "../sections/Terminal/components/CommandList";
import { HelpList } from "../sections/Terminal/components/HelpList";
import type { CommandHistoryItem } from "../types";

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
  const [historyIndex, setHistoryIndex] = useState(-1);

  const runCommand = useCallback(
    (command: string) => {
      let output = "";

      switch (command) {
        // Handle site commands
        case Object.keys(goSiteToCommands).find((cmd) => cmd === command): {
          const site =
            goSiteToCommands[command as keyof typeof goSiteToCommands];
          output = `Opening site: ${site}`;
          setCommandOutput(output);
          setTimeout(() => {
            window.open(site, "_blank");
          }, 600);
          break;
        }

        // Terminal commands
        case terminalCommands.history: {
          const historyString = `${commandHistory
            .map((historyItem) => `* ${historyItem.command}`)
            .join("<br />")}<br />* ${command}`;
          setCommandOutput(historyString);
          break;
        }

        case terminalCommands.fullscreen: {
          document.documentElement.requestFullscreen();
          setCommandOutput("Fullscreen mode activated.");
          break;
        }

        case terminalCommands.minimize: {
          document.exitFullscreen();
          setCommandOutput("Minimized mode activated.");
          break;
        }

        case terminalCommands.clear: {
          setCommandOutput("");
          setCommand("");
          setIsFullscreenTerminal(false);
          if (commandPromptRef.current) {
            commandPromptRef.current.value = "";
          }
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
        }

        case terminalCommands.terminal: {
          setCommandOutput(
            "Terminal mode activated. Press ESC to exit full screen. <br /><br />Type 'exit' to exit terminal mode, but stay fullscreen. <br /><br />'clear' is a nice abort command."
          );
          document.documentElement.requestFullscreen();
          setIsFullscreenTerminal(true);
          break;
        }

        case terminalCommands.exit: {
          setIsFullscreenTerminal(false);
          break;
        }

        case terminalCommands.compgen: {
          setCommandOutput("::show-command-list::");
          break;
        }

        case terminalCommands.help: {
          setCommandOutput("::show-help-list::");
          break;
        }

        default: {
          output = `bash: command not found: ${command}`;
          setCommandError(output);
        }
      }

      // add command to command history
      setCommandHistory([
        ...commandHistory,
        { command, output, error: commandError },
      ]);

      // clear prompt line
      setCommand("");
      // reset history index (arrow up/down)
      setHistoryIndex(-1);
      if (commandPromptRef.current) {
        commandPromptRef.current.value = "";
      }
      setTimeout(() => {
        commandPromptRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    [commandHistory, commandError]
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
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex =
            historyIndex < commandHistory.length - 1
              ? historyIndex + 1
              : historyIndex;
          setHistoryIndex(newIndex);
          const historicCommand =
            commandHistory[commandHistory.length - 1 - newIndex]?.command || "";
          setCommand(historicCommand);
          if (commandPromptRef.current) {
            commandPromptRef.current.value = historicCommand;
          }
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyIndex > -1) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const historicCommand =
            newIndex === -1
              ? ""
              : commandHistory[commandHistory.length - 1 - newIndex]?.command ||
                "";
          setCommand(historicCommand);
          if (commandPromptRef.current) {
            commandPromptRef.current.value = historicCommand;
          }
        }
      } else if (event.key === "Escape" && !event.shiftKey) {
        event.preventDefault();
        setCommand("");
        setCommandError("");
        setCommandOutput("");
        setIsFullscreenTerminal(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        if (commandPromptRef.current) {
          commandPromptRef.current.value = "";
        }
      } else if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        runCommandAlias(command.toLowerCase());
      } else if (
        event.key === "Tab" &&
        commandsThatMatchPartialCommand.length === 1
      ) {
        event.preventDefault();
        const matchedCommand = commandsThatMatchPartialCommand[0];
        setCommand(matchedCommand);
        if (commandPromptRef.current) {
          commandPromptRef.current.value = matchedCommand;
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command, commandHistory, historyIndex, runCommand]);

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

  const handleCommandClick = useCallback((cmd: string) => {
    if (commandPromptRef.current) {
      commandPromptRef.current.value = cmd;
      setCommand(cmd);
      commandPromptRef.current.focus();
    }
  }, []);

  const hideCommandSuggestions =
    commandOutput === "::show-command-list::" ||
    commandOutput === "::show-help-list::" ||
    matchingCommandTyped ||
    commandError;

  if (isFullscreenTerminal) {
    return (
      <FullscreenTerminal
        commandHistory={commandHistory}
        commandPromptRef={commandPromptRef}
        setCommand={setCommand}
        commandError={commandError}
        commandOutput={commandOutput}
        terminalCommands={terminalCommands}
      />
    );
  }

  console.log("commandOutput", commandOutput);

  return (
    <Frame>
      {isFullscreenTerminal && <div>Fullscreen mode activated.</div>}
      <Title />

      <CommandInput
        commandPromptRef={commandPromptRef}
        setCommand={setCommand}
      />

      {commandOutput === "::show-command-list::" ? (
        <CommandList
          commands={allCommands}
          onCommandClick={handleCommandClick}
        />
      ) : commandOutput === "::show-help-list::" ? (
        <HelpList
          commands={terminalCommands}
          onCommandClick={handleCommandClick}
        />
      ) : (
        <CommandOutput error={commandError} output={commandOutput} />
      )}

      {!matchingCommandTyped && !hideCommandSuggestions && (
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
