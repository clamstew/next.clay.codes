import { useEffect, useRef, useState, useCallback } from "react";
import { goSiteToCommands, terminalCommands, allCommands } from "./constants";
import { getMatchingCommands } from "../shared/utils/commands-utils";

interface CommandHistoryItem {
  command: string;
  output: string;
}

interface CommandExampleProps {
  cmd: string;
  setCommand: (cmd: string) => void;
  commandPromptRef: React.RefObject<HTMLInputElement>;
}

const CommandExample = ({
  cmd,
  setCommand,
  commandPromptRef,
}: CommandExampleProps) => (
  <li>
    <button
      style={{ cursor: "pointer" }}
      onClick={() => {
        setCommand(cmd);
        if (commandPromptRef.current) {
          commandPromptRef.current.value = cmd;
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setCommand(cmd);
          if (commandPromptRef.current) {
            commandPromptRef.current.value = cmd;
          }
        }
      }}
    >
      {cmd}
    </button>
  </li>
);

interface CommandInputProps {
  commandPromptRef: React.RefObject<HTMLInputElement>;
  setCommand: (value: string) => void;
}

const CommandInput = ({ commandPromptRef, setCommand }: CommandInputProps) => (
  <div className="flex items-center">
    <div className="inline-block text-white text-[40px]">$&gt;</div>
    <input
      ref={commandPromptRef}
      spellCheck="false"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      onChange={(e) => setCommand(e.target.value)}
      placeholder="run a command ..."
      className="inline-block bg-[#282c34] text-white border-none outline-none w-[500px] h-[46px] text-[30px] md:max-w-[94%]"
    />
  </div>
);

interface CommandOutputProps {
  error: string;
  output: string;
}

const CommandOutput = ({ error, output }: CommandOutputProps) => (
  <>
    {error && (
      <div className="text-red-500 text-left w-[548px] mb-[30px]">{error}</div>
    )}
    {output && (
      <div
        className="text-green-500 text-left w-[548px] mb-[30px]"
        dangerouslySetInnerHTML={{ __html: output }}
      />
    )}
  </>
);

interface CommandSuggestionsProps {
  matchingCommands: string[];
  command: string;
  tryAgain: () => void;
  setCommand: (cmd: string) => void;
  commandPromptRef: React.RefObject<HTMLInputElement>;
}

const CommandSuggestions = ({
  matchingCommands,
  command,
  tryAgain,
  setCommand,
  commandPromptRef,
}: CommandSuggestionsProps) => (
  <div className="text-white border border-white box-border text-left p-[15px] text-[16px] w-[530px] md:max-w-[94%]">
    {matchingCommands.length > 0 && <div>Commands to try:</div>}
    {matchingCommands.length === 0 && (
      <div>
        No matching commands.{" "}
        <a href="#/" onClick={tryAgain} className="text-[#61dafb]">
          Try again.
        </a>
      </div>
    )}
    <div className="columns-2 mt-[20px]">
      <ul className="m-0">
        {command === "" &&
          allCommands.map((cmd) => (
            <CommandExample
              key={cmd}
              cmd={cmd}
              setCommand={setCommand}
              commandPromptRef={commandPromptRef}
            />
          ))}
        {command !== "" &&
          matchingCommands.map((cmd) => (
            <CommandExample
              key={cmd}
              cmd={cmd}
              setCommand={setCommand}
              commandPromptRef={commandPromptRef}
            />
          ))}
      </ul>
    </div>
  </div>
);

function App() {
  const commandPromptRef = useRef<HTMLInputElement>(null);
  const [command, setCommand] = useState("");
  const [commandError, setCommandError] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>(
    []
  );

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
      // https://stackoverflow.com/questions/47809282/submit-a-form-when-enter-is-pressed-in-a-textarea-in-react?rq=1
      // console.warn("what keycode", event.which);
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

  const matchingCommandTyped =
    commandsThatMatchPartialCommand.length === 1 &&
    commandsThatMatchPartialCommand[0] === command;

  return (
    <div className="text-center">
      <header className="bg-[#282c34] min-h-screen flex flex-col items-center justify-center text-[calc(10px+2vmin)] text-cyan-500">
        <code className="text-[40px] font-normal select-none text-[rgb(0, 255, 255)]">
          &lt;clay.codes /&gt;
        </code>

        <div
          className={commandOutput || commandError ? "mt-[50px]" : "my-[50px]"}
        >
          <CommandInput
            commandPromptRef={commandPromptRef}
            setCommand={setCommand}
          />
        </div>

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
          <div>
            <span>Press</span>{" "}
            <button
              onClick={() => runCommand(command)}
              className="bg-[#282c34] border border-white text-white rounded-[5px] text-[18px] cursor-pointer hover:shadow-[0_0_0_2px_white]"
            >
              Enter
            </button>{" "}
            <span>or</span>{" "}
            <a href="#/" onClick={tryAgain} className="text-[#61dafb]">
              Try again.
            </a>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
