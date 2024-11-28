import { useEffect } from "react";

interface CommandInputProps {
  commandPromptRef: React.RefObject<HTMLInputElement>;
  setCommand: (value: string) => void;
  commandOutput?: string;
  commandError?: string;
}

export const CommandInput = ({
  commandPromptRef,
  setCommand,
  commandOutput,
  commandError,
}: CommandInputProps) => {
  useEffect(() => {
    commandPromptRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandOutput, commandError, commandPromptRef]);

  return (
    <div className={commandOutput || commandError ? "mt-[50px]" : "my-[50px]"}>
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
    </div>
  );
};
