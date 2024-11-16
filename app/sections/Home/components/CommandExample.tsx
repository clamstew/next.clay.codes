interface CommandExampleProps {
  cmd: string;
  setCommand: (cmd: string) => void;
  commandPromptRef: React.RefObject<HTMLInputElement>;
}

export const CommandExample = ({
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
