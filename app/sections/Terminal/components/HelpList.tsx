import type { Command } from "~/types";

interface HelpListProps {
  commands: Record<string, Command>;
  onCommandClick: (command: string) => void;
}

export const HelpList = ({ commands, onCommandClick }: HelpListProps) => (
  <div className="flex flex-col gap-1 text-left">
    <div className="text-white/80">
      Available commands and their descriptions:
    </div>
    {Object.values(commands).map((cmd) => (
      <div key={cmd.command} className="flex flex-col gap-0.5 mb-2">
        <button
          onClick={() => onCommandClick(cmd.command)}
          className="text-left text-blue-400 hover:bg-blue-400/10 rounded px-2 py-0.5 cursor-pointer font-mono transition-colors w-fit"
        >
          {cmd.command}
        </button>
        <div className="text-white/60 text-sm ml-2">
          <span className="font-bold">{cmd.title}</span> - {cmd.description}
        </div>
      </div>
    ))}
  </div>
);
