import { useEffect } from "react";
import cn from "classnames";

interface CommandInputProps {
  commandPromptRef: React.RefObject<HTMLInputElement>;
  setCommand: (value: string) => void;
  commandOutput?: string;
  commandError?: string;
  isFullscreenTerminal: boolean;
}

export const CommandInput = ({
  commandPromptRef,
  setCommand,
  commandOutput,
  commandError,
  isFullscreenTerminal = false,
}: CommandInputProps) => {
  useEffect(() => {
    commandPromptRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandOutput, commandError, commandPromptRef]);

  return (
    <div
      className={
        commandOutput || commandError
          ? "[@media(min-width:530px)]:mt-[50px] mt-[10px]"
          : "[@media(min-width:530px)]:my-[50px] my-[10px]"
      }
    >
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
          className={cn(
            "inline-block bg-[#282c34] text-white border-none outline-none w-full [@media(min-width:400px)]:w-[500px] h-[46px] text-[30px] md:max-w-[94%]",
            {
              "w-[100%]": isFullscreenTerminal,
              "bg-black": isFullscreenTerminal,
            }
          )}
        />
      </div>
    </div>
  );
};
