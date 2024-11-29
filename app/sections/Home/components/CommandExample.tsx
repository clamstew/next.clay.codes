import type { Command } from "~/types";
import cn from "classnames";

interface CommandExampleProps {
  cmd: Command;
  setCommand: (cmd: string) => void;
  commandPromptRef: React.RefObject<HTMLInputElement>;
}

const ARROW_EMOJI = "▻";

export const CommandExample = ({
  cmd,
  setCommand,
  commandPromptRef,
}: CommandExampleProps) => {
  const prefix = cmd?.emoji ? `${cmd.emoji} ` : `${ARROW_EMOJI} `;
  const isTerminalCommand = cmd.type === "terminal";
  const isGoToSiteCommand = cmd.type === "webpage-shortcut";
  return (
    <li>
      <button
        style={{ cursor: "pointer" }}
        className={cn(
          isTerminalCommand && "hover:text-green-500",
          isGoToSiteCommand && "hover:text-blue-500"
        )}
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
        aria-label={cmd.description}
        title={cmd.description}
      >
        {`${prefix}${cmd.command}`}
      </button>
    </li>
  );
};
