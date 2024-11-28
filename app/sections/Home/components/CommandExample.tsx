import type { Command } from "~/types";

interface CommandExampleProps {
  cmd: Command;
  setCommand: (cmd: string) => void;
  commandPromptRef: React.RefObject<HTMLInputElement>;
}

export const CommandExample = ({
  cmd,
  setCommand,
  commandPromptRef,
}: CommandExampleProps) => {
  const { emoji } = cmd;
  const prefix = emoji ? `${emoji} ` : "▻ ";
  return (
    <li>
      <button
        style={{ cursor: "pointer" }}
        onClick={() => {
          setCommand(cmd.command);
          if (commandPromptRef.current) {
            commandPromptRef.current.value = cmd.command;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setCommand(cmd.command);
            if (commandPromptRef.current) {
              commandPromptRef.current.value = cmd.command;
            }
          }
        }}
      >
        {`${prefix}${cmd.command}`}
      </button>
    </li>
  );
};
