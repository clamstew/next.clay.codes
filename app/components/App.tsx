import { useRef } from "react";
import { goSiteToCommands, terminalCommands, allCommands } from "./constants";
import { getMatchingCommands } from "../shared/utils/commands-utils";
import { CommandInput } from "../sections/Home/components/CommandInput";
import { CommandSuggestions } from "../sections/Home/components/CommandSuggestions";
import { CommandOutput } from "../sections/Home/components/CommandOutput";
import { MatchedCommandOutput } from "../sections/Home/components/MatchedCommandOutput";
import { Title } from "../sections/Home/components/Title";
import { Frame } from "~/sections/Home/components/Frame";
import { signal, effect } from "@preact/signals-react";

interface CommandHistoryItem {
  command: string;
  output: string;
}

const isHydratedSignal = signal(false);
// Move hydration check to useState to avoid client/server mismatch
function isHydrated() {
  if (typeof window !== "undefined") {
    isHydratedSignal.value = true;
  }
  return isHydratedSignal.value;
}

// function checkHydration() {
//   if (typeof window !== "undefined") {
//     console.debug("[Hydration] Client-side hydration completed");
//     isHydratedSignal.value = true;
//   } else {
//     console.debug("[Hydration] Server-side render");
//   }
//   return isHydratedSignal.value;
// }

const detectMatchingCommandFound = (
  matchingCommands: string[],
  command: string
): boolean => {
  return matchingCommands.length === 1 && matchingCommands[0] === command;
};

const commandSignal = signal("");
const commandErrorSignal = signal("");
const commandOutputSignal = signal("");
const commandHistorySignal = signal<CommandHistoryItem[]>([]);

const runCommand = (command: string) => {
  console.warn("running command", command);
  let output = "";
  if (goSiteToCommands[command as keyof typeof goSiteToCommands]) {
    output = `Opening site: ${
      goSiteToCommands[command as keyof typeof goSiteToCommands]
    }`;
    commandOutputSignal.value = output;
    // delay for a hot second, so user can see the output
    setTimeout(() => {
      window.open(
        goSiteToCommands[command as keyof typeof goSiteToCommands],
        "_blank"
      );
    }, 600);
  } else if (command === terminalCommands.history) {
    // print history
    const historyString = `${commandHistorySignal.value
      .map((historyItem) => historyItem.command)
      .join("<br />")}<br />${command}`;
    commandOutputSignal.value = historyString;
  } else {
    output = `bash: command not found: ${command}`;
    commandErrorSignal.value = output;
  }

  // add command to command history
  commandHistorySignal.value = [
    ...commandHistorySignal.value,
    { command, output },
  ];
};

function App() {
  const commandPromptRef = useRef<HTMLInputElement>(null);

  const hydrated = isHydrated();

  effect(() => {
    if (!hydrated) return;

    const currentCommandPromptRef = commandPromptRef.current;
    if (!currentCommandPromptRef) return;

    currentCommandPromptRef.focus();

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
      // https://stackoverflow.com/questions/47809282/submit-a-form-when-enter-is-pressed-in-a-textarea-in-react?rq=1
      if (event.which === 27 && event.shiftKey === false) {
        event.preventDefault();
        commandSignal.value = "";
        commandErrorSignal.value = "";
        commandOutputSignal.value = "";
        if (commandPromptRef.current) {
          commandPromptRef.current.value = "";
        }
      } else if (event.which === 13 && event.shiftKey === false) {
        event.preventDefault();
        runCommand(commandSignal.value.toLowerCase());
      } else {
        commandErrorSignal.value = "";
        commandOutputSignal.value = "";
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
  });

  const commandsThatMatchPartialCommand = getMatchingCommands(
    commandSignal.value,
    allCommands
  );

  const tryAgain = () => {
    commandSignal.value = "";
    commandErrorSignal.value = "";
    commandOutputSignal.value = "";
    if (commandPromptRef.current) {
      commandPromptRef.current.value = "";
    }
  };

  const matchingCommandTyped = detectMatchingCommandFound(
    commandsThatMatchPartialCommand,
    commandSignal.value
  );

  if (!hydrated) {
    console.debug("[App] Waiting for hydration...");
    return <div>Loading...</div>; // Or a proper loading state
  }

  return (
    <Frame>
      <Title />

      <div
        className={
          commandOutputSignal.value || commandErrorSignal.value
            ? "mt-[50px]"
            : "my-[50px]"
        }
      >
        <CommandInput
          commandPromptRef={commandPromptRef}
          setCommand={(value) => (commandSignal.value = value)}
        />
      </div>

      <CommandOutput
        error={commandErrorSignal.value}
        output={commandOutputSignal.value}
      />

      {!matchingCommandTyped && (
        <CommandSuggestions
          matchingCommands={commandsThatMatchPartialCommand}
          command={commandSignal.value}
          setCommand={(value) => (commandSignal.value = value)}
          tryAgain={tryAgain}
          commandPromptRef={commandPromptRef}
        />
      )}

      {matchingCommandTyped && (
        <MatchedCommandOutput
          command={commandSignal.value}
          runCommand={runCommand}
          tryAgain={tryAgain}
        />
      )}
    </Frame>
  );
}

export default App;
