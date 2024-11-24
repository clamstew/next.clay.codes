import { effect, computed, signal, type Signal } from "@preact/signals";
import { ComponentChildren, createContext } from "preact";
import { CommandInput } from "../sections/Home/components/CommandInput";
import { CommandSuggestions } from "../sections/Home/components/CommandSuggestions";
import { CommandOutput } from "../sections/Home/components/CommandOutput";
import { MatchedCommandOutput } from "../sections/Home/components/MatchedCommandOutput";
import { Title } from "../sections/Home/components/Title";
import { Frame } from "~/sections/Home/components/Frame";
import { goSiteToCommands, terminalCommands, allCommands } from "./constants";
import { getMatchingCommands } from "../shared/utils/commands-utils";

interface CommandHistoryItem {
  command: string;
  output: string;
}

interface AppContextType {
  commandSignal: Signal<string>;
  commandErrorSignal: Signal<string>;
  commandOutputSignal: Signal<string>;
  commandHistorySignal: Signal<CommandHistoryItem[]>;
  matchingCommandsSignal: Signal<string[]>;
  runCommand: (command: string) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ComponentChildren }) {
  const commandSignal = signal("");
  const commandErrorSignal = signal("");
  const commandOutputSignal = signal("");
  const commandHistorySignal = signal<CommandHistoryItem[]>([]);
  const matchingCommandsSignal = computed(() =>
    getMatchingCommands(commandSignal.value, allCommands)
  );

  const runCommand = (command: string) => {
    console.log("Running command:", command);
    let output = "";

    if (goSiteToCommands[command as keyof typeof goSiteToCommands]) {
      output = `Opening site: ${
        goSiteToCommands[command as keyof typeof goSiteToCommands]
      }`;
      commandOutputSignal.value = output;
      setTimeout(() => {
        window.open(
          goSiteToCommands[command as keyof typeof goSiteToCommands],
          "_blank"
        );
      }, 600);
    } else if (command === terminalCommands.history) {
      const historyString = `${commandHistorySignal.value
        .map((item: CommandHistoryItem) => item.command)
        .join("<br />")}<br />${command}`;
      commandOutputSignal.value = historyString;
    } else {
      output = `bash: command not found: ${command}`;
      commandErrorSignal.value = output;
    }

    commandHistorySignal.value = [
      ...commandHistorySignal.value,
      { command, output },
    ];
  };
  return (
    <AppContext.Provider
      value={{
        commandSignal,
        commandErrorSignal,
        commandOutputSignal,
        commandHistorySignal,
        matchingCommandsSignal,
        runCommand,
      }}
    >
      <App />
    </AppContext.Provider>
  );
}

function App() {
  const {
    commandSignal,
    commandErrorSignal,
    commandOutputSignal,
    matchingCommandsSignal,
    runCommand,
  } = useContext(AppContext);

  const commandPromptRef = signal<HTMLInputElement | null>(null);

  // Effect to handle keyboard events
  effect(() => {
    const inputElement = commandPromptRef.value;
    if (!inputElement) return;

    inputElement.focus();

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        commandSignal.value = "";
        commandErrorSignal.value = "";
        commandOutputSignal.value = "";
      } else if (event.key === "Enter") {
        event.preventDefault();
        const command = commandSignal.value.toLowerCase();
        runCommand(command);
      }
    };

    inputElement.addEventListener("keydown", keyDownHandler);

    return () => {
      inputElement.removeEventListener("keydown", keyDownHandler);
    };
  });

  const tryAgain = () => {
    commandSignal.value = "";
    commandErrorSignal.value = "";
    commandOutputSignal.value = "";
    if (commandPromptRef.value) {
      commandPromptRef.value.value = "";
    }
  };

  const matchingCommandTyped = computed(
    () =>
      matchingCommandsSignal.value.length === 1 &&
      matchingCommandsSignal.value[0] === commandSignal.value
  );

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
          commandPromptRef={(ref) => (commandPromptRef.value = ref)}
          setCommand={(value) => (commandSignal.value = value)}
        />
      </div>
      <CommandOutput
        error={commandErrorSignal.value}
        output={commandOutputSignal.value}
      />
      {matchingCommandsSignal.value.length > 1 && (
        <CommandSuggestions
          matchingCommands={matchingCommandsSignal.value}
          command={commandSignal.value}
          setCommand={(value) => (commandSignal.value = value)}
          tryAgain={tryAgain}
          commandPromptRef={(ref) => (commandPromptRef.value = ref)}
        />
      )}
      {matchingCommandTyped.value && (
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
