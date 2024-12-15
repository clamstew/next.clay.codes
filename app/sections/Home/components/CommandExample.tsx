import type { Command } from "~/types";
import cn from "classnames";
import { useCommandTranslation } from "~/shared/utils/hooks/use-command-translation";

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
  const { translateCommand } = useCommandTranslation();
  const translatedCommand = translateCommand(cmd);
  const prefix = translatedCommand?.emoji
    ? `${translatedCommand.emoji}    `
    : `${ARROW_EMOJI}   `;
  const isTerminalCommand = translatedCommand.type === "terminal";
  const isGoToSiteCommand = translatedCommand.type === "webpage-shortcut";
  return (
    <li>
      <button
        style={{ cursor: "pointer" }}
        className={cn(
          isTerminalCommand && "hover:text-[#A6E22E]",
          isGoToSiteCommand && "hover:text-[#66D9EF]"
        )}
        onClick={() => {
          setCommand(translatedCommand.command);
          if (commandPromptRef.current) {
            commandPromptRef.current.value = translatedCommand.command;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setCommand(translatedCommand.command);
            if (commandPromptRef.current) {
              commandPromptRef.current.value = translatedCommand.command;
            }
          }
        }}
        aria-label={translatedCommand.description}
        title={translatedCommand.description}
      >
        {`${prefix}${translatedCommand.command}`}
      </button>
    </li>
  );
};
