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

interface CommandHistoryItem {
  command: string;
  output: string;
  error: string;
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
  const [historyIndex, setHistoryIndex] = useState(-1);

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
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      } else if (command === terminalCommands.terminal) {
        setCommandOutput(
          "Terminal mode activated. Press ESC to exit full screen. <br /><br />Type 'exit' to exit terminal mode, but stay fullscreen. <br /><br />'clear' is a nice abort command."
        );
        document.documentElement.requestFullscreen();
        setIsFullscreenTerminal(true);
      } else if (command === terminalCommands.exit) {
        setIsFullscreenTerminal(false);
      } else if (command === terminalCommands.compgen) {
        setCommandOutput("::show-command-list::");
      } else if (command === terminalCommands.help) {
        setCommandOutput("::show-help-list::");
      } else {
        output = `bash: command not found: ${command}`;
        setCommandError(output);
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
