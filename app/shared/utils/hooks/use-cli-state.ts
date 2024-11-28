import { useCallback, useEffect, useRef, useState } from "react";
import {
  allCommands,
  goSiteToCommands,
  terminalCommands,
} from "~/components/constants";
import type { CommandHistoryItem } from "~/types";
import { EventKeyName, SpecialCommandOutputTokens } from "~/types";
import { updateCommandPromptValue } from "~/components/App";
import { getMatchingCommands } from "../commands-utils";
import { delayOpenSite, safeExitFullscreen } from "../browser";

const detectMatchingCommandFound = (
  matchingCommands: string[],
  command: string
): boolean => {
  return matchingCommands.length === 1 && matchingCommands[0] === command;
};

const getNextHistoryIndex = (
  historyIndex: number,
  commandHistory: CommandHistoryItem[]
): number => {
  return historyIndex < commandHistory.length - 1
    ? historyIndex + 1
    : historyIndex;
};

const devOutput = (
  event: KeyboardEvent,
  commandHistory: CommandHistoryItem[]
) => {
  if (process.env.NODE_ENV === "development") {
    console.warn("what am i typing:", (event.target as HTMLInputElement).value);

    // log command history for debugging
    console.groupCollapsed("command history");
    console.table(commandHistory);
    console.groupEnd();
  }
};

const scrollToCommandPrompt = (
  commandPromptRef: React.RefObject<HTMLInputElement>,
  delay?: number,
  behavior?: ScrollOptions["behavior"]
) => {
  setTimeout(() => {
    commandPromptRef.current?.scrollIntoView({
      behavior: behavior || "smooth",
    });
  }, delay || 100);
};

function useCliState() {
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
      const tc = terminalCommands; // for readability in the switch

      switch (command) {
        // Handle open site commands
        case Object.keys(goSiteToCommands).find((cmd) => cmd === command): {
          const site =
            goSiteToCommands[command as keyof typeof goSiteToCommands];
          output = `Opening site: ${site}`;
          setCommandOutput(output);
          delayOpenSite(site);
          break;
        }

        // Terminal commands
        case tc.history.command: {
          const historyString = `${commandHistory
            .map((historyItem) => `* ${historyItem.command}`)
            .join("<br />")}<br />* ${command}`;
          setCommandOutput(historyString);
          break;
        }

        case tc.fullscreen.command: {
          document.documentElement.requestFullscreen();
          setCommandOutput("Fullscreen mode activated.");
          break;
        }

        case tc.minimize.command: {
          safeExitFullscreen();
          setCommandOutput("Minimized mode activated.");
          break;
        }

        case tc.clear.command: {
          setCommandOutput("");
          setCommand("");
          setIsFullscreenTerminal(false);
          updateCommandPromptValue(commandPromptRef, "");
          safeExitFullscreen();
          break;
        }

        case tc.terminal.command: {
          setCommandOutput(
            "Terminal mode activated. Press ESC to exit full screen. <br /><br />Type 'exit' to exit terminal mode, but stay fullscreen. <br /><br />'clear' is a nice abort command."
          );
          setIsFullscreenTerminal(true);
          document.documentElement.requestFullscreen();
          break;
        }

        case tc.exit.command: {
          setIsFullscreenTerminal(false);
          break;
        }

        case tc.compgen.command: {
          setCommandOutput(SpecialCommandOutputTokens.ShowCommandList);
          break;
        }

        case tc.help.command: {
          setCommandOutput(SpecialCommandOutputTokens.ShowHelpList);
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
        {
          command,
          output,
          error: commandError,
          timestamp: Date.now(),
          isFullscreenTerminal,
          historyIndex,
          rawCommand: allCommands.find((cmd) => cmd.command === command),
        },
      ]);

      // clear prompt line
      setCommand("");
      // reset history index (arrow up/down)
      setHistoryIndex(-1);
      updateCommandPromptValue(commandPromptRef, "");
      scrollToCommandPrompt(commandPromptRef);
    },
    [commandHistory, commandError, isFullscreenTerminal, historyIndex]
  );

  useEffect(() => {
    const currentCommandPromptRef = commandPromptRef.current;
    if (!currentCommandPromptRef) return;

    currentCommandPromptRef.focus();

    const runCommandAlias = runCommand;

    const keyUpEventListener = (event: KeyboardEvent) => {
      devOutput(event, commandHistory);
      // TODO: will run command highlighting here
    };

    const keyDownEventListener = (event: KeyboardEvent) => {
      switch (event.key as EventKeyName) {
        case EventKeyName.ArrowUp: {
          event.preventDefault();
          if (commandHistory.length > 0) {
            const newIndex = getNextHistoryIndex(historyIndex, commandHistory);
            setHistoryIndex(newIndex);
            const historicCommand =
              commandHistory[commandHistory.length - 1 - newIndex]?.command ||
              "";
            setCommand(historicCommand);
            updateCommandPromptValue(commandPromptRef, historicCommand);
          }
          break;
        }

        case EventKeyName.ArrowDown: {
          event.preventDefault();
          if (historyIndex > -1) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            const historicCommand =
              newIndex === -1
                ? ""
                : commandHistory[commandHistory.length - 1 - newIndex]
                    ?.command || "";
            setCommand(historicCommand);
            updateCommandPromptValue(commandPromptRef, historicCommand);
          }
          break;
        }

        case EventKeyName.Escape: {
          if (!event.shiftKey) {
            event.preventDefault();
            setCommand("");
            setCommandError("");
            setCommandOutput("");
            setIsFullscreenTerminal(false);
            safeExitFullscreen();
            updateCommandPromptValue(commandPromptRef, "");
          }
          break;
        }

        case EventKeyName.Enter: {
          if (!event.shiftKey) {
            event.preventDefault();
            runCommandAlias(command.toLowerCase());
          }
          break;
        }

        case EventKeyName.Tab: {
          if (commandsThatMatchPartialCommand.length === 1) {
            event.preventDefault();
            const matchedCommand = commandsThatMatchPartialCommand[0];
            setCommand(matchedCommand.command);
            updateCommandPromptValue(commandPromptRef, matchedCommand.command);
          }
          break;
        }

        default: {
          setCommandError("");
          setCommandOutput("");
        }
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
    command, // Pass command wrapped in object to match Command type
    allCommands
  );

  const tryAgain = () => {
    setCommand("");
    setCommandError("");
    setCommandOutput("");
    updateCommandPromptValue(commandPromptRef, "");
  };

  const matchingCommandTyped = detectMatchingCommandFound(
    commandsThatMatchPartialCommand.map((cmd) => cmd.command),
    command
  );

  return {
    commandPromptRef,
    command,
    setCommand,
    commandError,
    commandOutput,
    commandHistory,
    isFullscreenTerminal,
    historyIndex,
    runCommand,
    tryAgain,
    matchingCommandTyped,
    commandsThatMatchPartialCommand,
  };
}

export default useCliState;
