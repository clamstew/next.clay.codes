import { useEffect } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/components/App";

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
  const loaderData = useLoaderData<typeof loader>();
  const { t, ready } = useTranslation("common");
  const promptPlaceholder = ready
    ? t("terminal.promptPlaceholder")
    : loaderData.serverStrings.promptPlaceholder;

  useEffect(() => {
    commandPromptRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandOutput, commandError, commandPromptRef]);

  return (
    <div
      className={cn(
        "w-full [@media(min-width:600px)]:w-[500px] ",
        commandOutput || commandError
          ? "[@media(min-width:600px)]:mt-[50px] mt-[10px]"
          : "[@media(min-width:600px)]:my-[50px] my-[10px]"
      )}
    >
      <div className="flex items-center">
        <div className="inline-block text-white text-[40px]">$&gt;&nbsp;</div>
        <input
          ref={commandPromptRef}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          onChange={(e) => setCommand(e.target.value)}
          placeholder={promptPlaceholder}
          className={cn(
            "inline-block bg-[#282c34] text-white border-none outline-none w-full [@media(min-width:600px)]:w-[500px] h-[46px] text-[30px] md:max-w-[94%]",
            {
              "w-full": isFullscreenTerminal,
              "bg-black": isFullscreenTerminal,
            }
          )}
        />
      </div>
    </div>
  );
};
